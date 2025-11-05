import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/dashboard/notifications' },
];

interface Notification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    action_url: string | null;
    action_text: string | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

interface NotificationsPageProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    unreadCount: number;
}

export default function NotificationsIndex({ notifications, unreadCount }: NotificationsPageProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const handleMarkAsRead = (notification: Notification) => {
        if (!notification.is_read) {
            router.post(route('notifications.mark-read', notification.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleMarkAllAsRead = () => {
        router.post(route('notifications.mark-all-read'), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (!selectedNotification) return;

        router.delete(route('notifications.destroy', selectedNotification.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setSelectedNotification(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getTypeBgColor = (type: string, isRead: boolean) => {
        const opacity = isRead ? '50' : '100';
        switch (type) {
            case 'success':
                return `bg-green-${opacity}/10 border-green-${opacity}/20`;
            case 'warning':
                return `bg-yellow-${opacity}/10 border-yellow-${opacity}/20`;
            case 'error':
                return `bg-red-${opacity}/10 border-red-${opacity}/20`;
            default:
                return `bg-blue-${opacity}/10 border-blue-${opacity}/20`;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Bell className="h-8 w-8" />
                            Notifications
                        </h1>
                        <p className="text-muted-foreground">
                            Stay updated with your account activities
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button onClick={handleMarkAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{unreadCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Out of {notifications.total} total
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Notifications</CardTitle>
                        <CardDescription>
                            Showing {notifications.data.length} of {notifications.total} notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {notifications.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No notifications yet</h3>
                                <p className="text-muted-foreground">
                                    We'll notify you when something important happens
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`relative flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                                            notification.is_read 
                                                ? 'bg-background' 
                                                : 'bg-accent/50 border-primary/20'
                                        }`}
                                    >
                                        {/* Unread indicator */}
                                        {!notification.is_read && (
                                            <div className="absolute top-4 left-2 h-2 w-2 rounded-full bg-primary" />
                                        )}

                                        {/* Icon */}
                                        <div className="mt-1 ml-2">
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{notification.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                    {notification.action_url && notification.action_text && (
                                                        <Link
                                                            href={notification.action_url}
                                                            className="text-sm text-primary hover:underline mt-2 inline-block"
                                                        >
                                                            {notification.action_text} →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(notification.created_at)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification)}
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedNotification(notification);
                                                    setShowDeleteDialog(true);
                                                }}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Page {notifications.current_page} of {notifications.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={notifications.current_page === 1}
                                        onClick={() => router.get(route('notifications.index', { page: notifications.current_page - 1 }))}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={notifications.current_page === notifications.last_page}
                                        onClick={() => router.get(route('notifications.index', { page: notifications.current_page + 1 }))}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this notification? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
