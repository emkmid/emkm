<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }
    /**
     * Display a listing of invoices.
     */
    public function index(Request $request): Response
    {
        $query = Invoice::where('user_id', $request->user()->id)
            ->with(['customer', 'items']);

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('company_name', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $request->input('sort_by', 'invoice_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $invoices = $query->paginate(15)->withQueryString();

        // Add computed properties
        $invoices->getCollection()->transform(function ($invoice) {
            $invoice->is_overdue = $invoice->is_overdue;
            $invoice->days_until_due = $invoice->days_until_due;
            return $invoice;
        });

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only(['status', 'search', 'sort_by', 'sort_order']),
            'stats' => $this->getInvoiceStats($request->user()->id),
        ]);
    }

    /**
     * Show the form for creating a new invoice.
     */
    public function create(): Response
    {
        $user = auth()->user();

        // Check if user has access to invoice feature
        if (!$this->featureService->hasAccess($user, 'invoices.create')) {
            return Inertia::render('invoices/index', [
                'invoices' => [],
                'filters' => [],
                'stats' => $this->getInvoiceStats($user->id),
            ])->with('error', 'Upgrade ke paket Basic untuk membuat invoice.');
        }

        // Check invoice limit for current month
        $currentMonth = now()->startOfMonth();
        $invoiceCount = $user->invoices()
            ->where('invoice_date', '>=', $currentMonth)
            ->count();

        if ($this->featureService->hasReachedLimit($user, 'invoices.max_count', $invoiceCount)) {
            $limit = $this->featureService->getLimit($user, 'invoices.max_count');
            return redirect()
                ->route('invoices.index')
                ->with('error', "Anda telah mencapai batas {$limit} invoice bulan ini. Upgrade ke Pro untuk unlimited invoice.");
        }

        $customers = Customer::where('user_id', $user->id)
            ->select('id', 'name', 'company_name', 'email')
            ->orderBy('name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'company_name' => $customer->company_name,
                    'email' => $customer->email,
                    'display_name' => $customer->display_name,
                ];
            });

        $limit = $this->featureService->getLimit($user, 'invoices.max_count');

        return Inertia::render('invoices/create', [
            'customers' => $customers,
            'quota' => [
                'current' => $invoiceCount,
                'limit' => $limit,
                'remaining' => $this->featureService->getRemainingQuota($user, 'invoices.max_count', $invoiceCount),
                'is_unlimited' => $limit === -1,
            ],
        ]);
    }

    /**
     * Store a newly created invoice.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Double check feature access
        if (!$this->featureService->hasAccess($user, 'invoices.create')) {
            abort(403, 'Anda tidak memiliki akses ke fitur ini.');
        }

        // Check limit again (prevent race condition)
        $currentMonth = now()->startOfMonth();
        $invoiceCount = $user->invoices()
            ->where('invoice_date', '>=', $currentMonth)
            ->count();

        if ($this->featureService->hasReachedLimit($user, 'invoices.max_count', $invoiceCount)) {
            return redirect()
                ->back()
                ->with('error', 'Limit invoice tercapai. Upgrade untuk membuat lebih banyak invoice.');
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Create invoice
        $invoice = $request->user()->invoices()->create([
            'customer_id' => $validated['customer_id'],
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount_rate' => $validated['discount_rate'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'terms' => $validated['terms'] ?? null,
        ]);

        // Create invoice items
        foreach ($validated['items'] as $index => $item) {
            $invoice->items()->create([
                'product_id' => $item['product_id'] ?? null,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'sort_order' => $index,
            ]);
        }

        // Calculate totals (will be done automatically by InvoiceItem boot method)
        $invoice->load('items');

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil dibuat.');
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['customer', 'items.product']);
        $invoice->is_overdue = $invoice->is_overdue;
        $invoice->days_until_due = $invoice->days_until_due;

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified invoice.
     */
    public function edit(Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        $invoice->load(['customer', 'items']);

        $customers = Customer::where('user_id', auth()->id())
            ->select('id', 'name', 'company_name', 'email')
            ->orderBy('name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->display_name,
                    'email' => $customer->email,
                ];
            });

        $products = Product::where('user_id', auth()->id())
            ->select('id', 'name', 'price')
            ->orderBy('name')
            ->get();

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified invoice.
     */
    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:invoice_items,id',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Update invoice
        $invoice->update([
            'customer_id' => $validated['customer_id'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount_rate' => $validated['discount_rate'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'terms' => $validated['terms'] ?? null,
        ]);

        // Delete removed items
        $existingItemIds = collect($validated['items'])->pluck('id')->filter();
        $invoice->items()->whereNotIn('id', $existingItemIds)->delete();

        // Update or create items
        foreach ($validated['items'] as $index => $itemData) {
            if (isset($itemData['id'])) {
                $item = InvoiceItem::find($itemData['id']);
                $item->update([
                    'product_id' => $itemData['product_id'] ?? null,
                    'description' => $itemData['description'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'sort_order' => $index,
                ]);
            } else {
                $invoice->items()->create([
                    'product_id' => $itemData['product_id'] ?? null,
                    'description' => $itemData['description'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil diperbarui.');
    }

    /**
     * Remove the specified invoice.
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dihapus.');
    }

    /**
     * Generate PDF for the invoice.
     */
    public function pdf(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['customer', 'items.product', 'user.businessProfile']);

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
        ]);

        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    /**
     * Mark invoice as sent.
     */
    public function markAsSent(Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $invoice->markAsSent();

        return back()->with('success', 'Invoice ditandai sebagai terkirim.');
    }

    /**
     * Mark invoice as paid.
     */
    public function markAsPaid(Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $invoice->markAsPaid();

        return back()->with('success', 'Invoice ditandai sebagai dibayar.');
    }

    /**
     * Get invoice statistics.
     */
    private function getInvoiceStats($userId): array
    {
        $invoices = Invoice::where('user_id', $userId);

        return [
            'total' => $invoices->count(),
            'draft' => $invoices->where('status', 'draft')->count(),
            'sent' => $invoices->where('status', 'sent')->count(),
            'paid' => $invoices->where('status', 'paid')->count(),
            'overdue' => $invoices->overdue()->count(),
            'total_amount' => $invoices->sum('total'),
            'paid_amount' => $invoices->where('status', 'paid')->sum('total'),
            'unpaid_amount' => $invoices->whereIn('status', ['draft', 'sent', 'overdue'])->sum('total'),
        ];
    }
}
