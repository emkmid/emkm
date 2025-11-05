import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Shield, 
    Search,
    Calendar,
    User,
    FileText,
    Eye,
    Filter,
    X
} from 'lucide-react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/dashboard/admin' },
    { title: 'Audit Logs', href: '/dashboard/admin/audit-logs' },
];

interface AuditLog {
    id: number;
    user_id: number | null;
    user: { name: string; email: string } | null;
    event: string;
    event_name: string;
    auditable_type: string;
    auditable_id: number;
    model_name: string;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    ip_address: string;
    user_agent: string;
    url: string;
    created_at: string;
}

interface AuditLogsPageProps {
    logs: {
        data: AuditLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        event?: string;
        model?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function AuditLogsIndex({ logs, filters }: AuditLogsPageProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilter = () => {
        router.get(route('admin.audit-logs.index'), localFilters, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setLocalFilters({});
        router.get(route('admin.audit-logs.index'), {}, {
            preserveState: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getEventColor = (event: string) => {
        switch (event) {
            case 'created':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'updated':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'deleted':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'restored':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof typeof filters]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                        <p className="text-muted-foreground">
                            Track semua aktivitas dan perubahan data dalam sistem
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                            <CardDescription>
                                Filter audit logs berdasarkan kriteria tertentu
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Search</Label>
                                    <Input
                                        placeholder="Search logs..."
                                        value={localFilters.search || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Type</Label>
                                    <Select
                                        value={localFilters.event || ''}
                                        onValueChange={(value) => setLocalFilters({ ...localFilters, event: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Events" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Events</SelectItem>
                                            <SelectItem value="created">Created</SelectItem>
                                            <SelectItem value="updated">Updated</SelectItem>
                                            <SelectItem value="deleted">Deleted</SelectItem>
                                            <SelectItem value="restored">Restored</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Model</Label>
                                    <Input
                                        placeholder="e.g., User, Product"
                                        value={localFilters.model || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, model: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Date From</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_from || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Date To</Label>
                                    <Input
                                        type="date"
                                        value={localFilters.date_to || ''}
                                        onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <Button onClick={handleFilter}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Apply Filters
                                </Button>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        <X className="mr-2 h-4 w-4" />
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{logs.total}</div>
                            <p className="text-xs text-muted-foreground">
                                All recorded activities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Logs List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>
                            Showing {logs.data.length} of {logs.total} logs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logs.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No audit logs found</h3>
                                <p className="text-muted-foreground">
                                    {hasActiveFilters 
                                        ? 'Try adjusting your filters' 
                                        : 'Activity logs will appear here'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.data.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="mt-1">
                                                {log.event === 'created' && <FileText className="h-5 w-5 text-green-600" />}
                                                {log.event === 'updated' && <FileText className="h-5 w-5 text-blue-600" />}
                                                {log.event === 'deleted' && <FileText className="h-5 w-5 text-red-600" />}
                                                {log.event === 'restored' && <FileText className="h-5 w-5 text-purple-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getEventColor(log.event)}`}>
                                                        {log.event_name}
                                                    </span>
                                                    <span className="text-sm font-medium">{log.model_name}</span>
                                                    <span className="text-sm text-muted-foreground">ID: {log.auditable_id}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {log.user ? log.user.name : 'System'}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(log.created_at)}
                                                    </span>
                                                    <span>•</span>
                                                    <span>IP: {log.ip_address}</span>
                                                </div>

                                                {/* Show sample of changes for updated events */}
                                                {log.event === 'updated' && log.new_values && (
                                                    <div className="mt-2 text-xs">
                                                        <span className="text-muted-foreground">
                                                            Changed: {Object.keys(log.new_values).slice(0, 3).join(', ')}
                                                            {Object.keys(log.new_values).length > 3 && '...'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.visit(route('admin.audit-logs.show', log.id))}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Page {logs.current_page} of {logs.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={logs.current_page === 1}
                                        onClick={() => router.get(route('admin.audit-logs.index'), { ...localFilters, page: logs.current_page - 1 })}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={logs.current_page === logs.last_page}
                                        onClick={() => router.get(route('admin.audit-logs.index'), { ...localFilters, page: logs.current_page + 1 })}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
