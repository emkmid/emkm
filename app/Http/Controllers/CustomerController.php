<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CustomerController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }
    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $query = Customer::where('user_id', $request->user()->id)
            ->with('invoices');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new customer.
     */
    public function create(): Response
    {
        $user = auth()->user();

        // Check if user has access to create customers
        if (!$this->featureService->hasAccess($user, 'customers.create')) {
            return redirect()
                ->route('customers.index')
                ->with('error', 'Upgrade ke paket Basic untuk mengelola customer.');
        }

        // Check customer limit
        $customerCount = $user->customers()->count();
        
        if ($this->featureService->hasReachedLimit($user, 'customers.max_count', $customerCount)) {
            $limit = $this->featureService->getLimit($user, 'customers.max_count');
            
            return redirect()
                ->route('customers.index')
                ->with('error', "Anda telah mencapai batas {$limit} customer. Upgrade ke Pro untuk unlimited customer.");
        }

        $limit = $this->featureService->getLimit($user, 'customers.max_count');

        return Inertia::render('customers/create', [
            'quota' => [
                'current' => $customerCount,
                'limit' => $limit,
                'remaining' => $this->featureService->getRemainingQuota($user, 'customers.max_count', $customerCount),
                'is_unlimited' => $limit === -1,
            ],
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Double check feature access
        if (!$this->featureService->hasAccess($user, 'customers.create')) {
            abort(403, 'Anda tidak memiliki akses ke fitur ini.');
        }

        // Check limit again
        $customerCount = $user->customers()->count();
        if ($this->featureService->hasReachedLimit($user, 'customers.max_count', $customerCount)) {
            return redirect()
                ->back()
                ->with('error', 'Limit customer tercapai. Upgrade untuk menambah lebih banyak customer.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_number' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $customer = $user->customers()->create($validated);

        return redirect()->route('customers.show', $customer)
            ->with('success', 'Customer berhasil ditambahkan.');
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): Response
    {
        $this->authorize('view', $customer);

        $customer->load([
            'invoices' => function ($query) {
                $query->latest()->with('items');
            }
        ]);

        return Inertia::render('customers/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified customer.
     */
    public function edit(Customer $customer): Response
    {
        $this->authorize('update', $customer);

        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('update', $customer);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'tax_number' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.show', $customer)
            ->with('success', 'Customer berhasil diperbarui.');
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $this->authorize('delete', $customer);

        // Check if customer has invoices
        if ($customer->invoices()->exists()) {
            return back()->with('error', 'Customer tidak dapat dihapus karena memiliki invoice.');
        }

        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer berhasil dihapus.');
    }

    /**
     * Get customers for dropdown/select.
     */
    public function list(Request $request)
    {
        $customers = Customer::where('user_id', $request->user()->id)
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

        return response()->json($customers);
    }
}
