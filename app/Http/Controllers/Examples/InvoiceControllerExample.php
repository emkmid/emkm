<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * EXAMPLE: Invoice Controller dengan Feature Limits
 * 
 * Ini adalah contoh implementasi pembatasan fitur di Invoice Controller.
 * Copy pola ini ke controller lain yang perlu dibatasi.
 */
class InvoiceControllerExample extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Show create invoice form
     * 
     * Cek:
     * 1. Apakah user bisa membuat invoice (feature: invoices.create)
     * 2. Apakah sudah mencapai limit invoice per bulan
     */
    public function create(Request $request)
    {
        $user = $request->user();

        // 1. Cek akses fitur invoice
        if (!$this->featureService->hasAccess($user, 'invoices.create')) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Upgrade ke paket Basic untuk membuat invoice.')
                ->with('upgrade_prompt', [
                    'feature' => 'Invoice Management',
                    'required_package' => 'Basic',
                    'price' => 29000,
                ]);
        }

        // 2. Cek limit invoice per bulan
        $currentMonth = now()->startOfMonth();
        $invoiceCount = $user->invoices()
            ->where('invoice_date', '>=', $currentMonth)
            ->count();

        if ($this->featureService->hasReachedLimit($user, 'invoices.max_count', $invoiceCount)) {
            $limit = $this->featureService->getLimit($user, 'invoices.max_count');
            
            return redirect()
                ->route('invoices.index')
                ->with('error', "Anda telah mencapai batas {$limit} invoice bulan ini. Upgrade ke Pro untuk unlimited invoice.")
                ->with('upgrade_prompt', [
                    'feature' => 'Unlimited Invoices',
                    'required_package' => 'Pro',
                    'price' => 59000,
                ]);
        }

        // 3. Get remaining quota untuk ditampilkan
        $remaining = $this->featureService->getRemainingQuota($user, 'invoices.max_count', $invoiceCount);
        $limit = $this->featureService->getLimit($user, 'invoices.max_count');

        $customers = Customer::where('user_id', $user->id)->get();

        return Inertia::render('invoices/create', [
            'customers' => $customers,
            'quota' => [
                'current' => $invoiceCount,
                'limit' => $limit,
                'remaining' => $remaining,
                'is_unlimited' => $limit === -1,
            ],
        ]);
    }

    /**
     * Store invoice
     * 
     * Double-check limits sebelum save
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Security: Double-check feature access
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

        // Validated dan create invoice...
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after:invoice_date',
            // ... validation lainnya
        ]);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            // ... data lainnya
        ]);

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil dibuat!');
    }

    /**
     * Export PDF
     * 
     * Cek apakah user bisa export PDF
     */
    public function pdf(Invoice $invoice)
    {
        $user = auth()->user();

        // Authorization check
        if ($invoice->user_id !== $user->id) {
            abort(403);
        }

        // Feature check
        if (!$this->featureService->hasAccess($user, 'invoices.pdf_export')) {
            return redirect()
                ->back()
                ->with('error', 'Upgrade ke Basic untuk export invoice ke PDF.');
        }

        // Generate PDF...
        $pdf = \PDF::loadView('invoices.pdf', ['invoice' => $invoice]);
        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }

    /**
     * Send invoice via email
     * 
     * Cek apakah user bisa kirim email (Pro only)
     */
    public function sendEmail(Invoice $invoice)
    {
        $user = auth()->user();

        if ($invoice->user_id !== $user->id) {
            abort(403);
        }

        // Feature check - hanya Pro yang bisa kirim email
        if (!$this->featureService->hasAccess($user, 'invoices.email_send')) {
            return redirect()
                ->back()
                ->with('error', 'Upgrade ke paket Pro untuk mengirim invoice via email.')
                ->with('upgrade_prompt', [
                    'feature' => 'Email Invoice to Customer',
                    'required_package' => 'Pro',
                    'price' => 59000,
                ]);
        }

        // Send email logic...
        // Mail::to($invoice->customer->email)->send(new InvoiceMail($invoice));

        return redirect()
            ->back()
            ->with('success', 'Invoice berhasil dikirim ke ' . $invoice->customer->email);
    }
}
