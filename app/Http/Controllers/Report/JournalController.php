<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Journal;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $query = Journal::with(['entries.account', 'user'])
            ->where('user_id', Auth::id());

        // Filter by month (format: Y-m)
        if ($request->has('month') && $request->month) {
            $query->whereRaw("strftime('%Y-%m', date) = ?", [$request->month]);
        }

        // Filter by expense category
        if ($request->has('expense_category') && $request->expense_category) {
            $query->whereHas('entries.account', function ($q) use ($request) {
                $q->where('name', $request->expense_category)
                  ->where('type', 'biaya');
            });
        }

        $journals = $query->orderBy('date', 'desc')
            ->paginate(10);

        return inertia('dashboard/user/reports/journal', [
            'journals' => $journals,
            'filters' => $request->only(['month', 'expense_category'])
        ]);
    }
}
