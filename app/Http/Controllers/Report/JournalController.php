<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Journal;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        $journals = Journal::with(['entries.account', 'user'])
            ->orderBy('date', 'desc')
            ->paginate(10);

        return inertia('dashboard/user/reports/journal', [
            'journals' => $journals
        ]);
    }
}
