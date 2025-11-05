<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        // Filter by event
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        // Filter by model
        if ($request->filled('model')) {
            $query->where('auditable_type', 'like', "%{$request->model}%");
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('auditable_type', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        $logs = $query->latest()->paginate(20)->appends($request->query());

        return Inertia::render('dashboard/admin/audit-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['event', 'model', 'user_id', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user');

        return Inertia::render('dashboard/admin/audit-logs/show', [
            'log' => $auditLog,
            'changes' => $auditLog->getChanges(),
        ]);
    }
}
