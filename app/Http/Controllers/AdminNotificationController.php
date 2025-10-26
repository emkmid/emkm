<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::with('creator')->paginate(10);

        return Inertia::render('dashboard/admin/notifications/index', [
            'notifications' => $notifications,
        ]);
    }

    public function create()
    {
        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('dashboard/admin/notifications/create', [
            'users' => $users,
        ]);
    }

    public function store(StoreNotificationRequest $request)
    {
        Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'target_users' => $request->target_users,
            'scheduled_at' => $request->scheduled_at,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('notifications.index')->with('success', 'Notification created successfully.');
    }

    public function edit(Notification $notification)
    {
        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('dashboard/admin/notifications/edit', [
            'notification' => $notification,
            'users' => $users,
        ]);
    }

    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $notification->update([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'target_users' => $request->target_users,
            'scheduled_at' => $request->scheduled_at,
        ]);

        return redirect()->route('notifications.index')->with('success', 'Notification updated successfully.');
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return redirect()->route('notifications.index')->with('success', 'Notification deleted successfully.');
    }
}
