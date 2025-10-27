import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Small helper for safe API requests used throughout this page.
async function apiFetch(url: string) {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
        // Try to include server body in error message for easier debugging
        const text = await res.text();
        throw new Error(text || res.statusText || `HTTP ${res.status}`);
    }
    if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error('Unexpected content-type: ' + contentType + ' — ' + (text ? text.slice(0, 200) : ''));
    }
    return res.json();
}

type Notification = {
    id: number;
    provider: string;
    order_id?: string;
    provider_event_id?: string;
    signature?: string;
    payload?: any;
    processed_at?: string | null;
    created_at?: string;
};

type SubscriptionItem = {
    id: number;
    user: { id: number; name?: string; email?: string } | null;
    package: { id: number; name?: string } | null;
    status: string;
    midtrans_order_id?: string | null;
    midtrans_transaction_id?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    created_at?: string;
};

export default function AdminPaymentsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(25);
    const [q, setQ] = useState<string>('');
    const [selected, setSelected] = useState<Notification | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState<boolean>(false);
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState<boolean>(false);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

    const pushToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
        setToasts((t) => [...t, { id, type, message }]);
        // auto remove after 4.5s
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
    };

    useEffect(() => {
        let cancelled = false;
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('per_page', String(perPage));
        if (q) params.set('q', q);

        setErrorMsg(null);

        setIsLoadingNotifications(true);
        apiFetch('/dashboard/admin/payments/list?' + params.toString())
            .then((data) => {
                if (cancelled) return;
                setNotifications(data.data || data || []);
                setTotalPages(data.last_page || data.meta?.last_page || 1);
            })
            .catch((err: Error) => {
                if (cancelled) return;
                console.error('Failed to load notifications:', err);
                setErrorMsg(err.message || 'Gagal memuat payment notifications');
            })
            .finally(() => {
                if (!cancelled) setIsLoadingNotifications(false);
            });

        setIsLoadingSubscriptions(true);
        apiFetch('/dashboard/admin/subscriptions/list?' + params.toString())
            .then((data) => {
                if (cancelled) return;
                setSubscriptions(data.data || data || []);
            })
            .catch((err: Error) => {
                if (cancelled) return;
                console.error('Failed to load subscriptions:', err);
                setErrorMsg((prev) => (prev ? prev + '\n' + err.message : err.message));
                pushToast(err.message || 'Gagal memuat subscriptions', 'error');
            })
            .finally(() => {
                if (!cancelled) setIsLoadingSubscriptions(false);
            });

        return () => {
            cancelled = true;
        };
    }, [page, perPage, q]);

    const refresh = () => setPage(1);

    const openDetail = async (id: number) => {
        setDetailLoading(true);
        setErrorMsg(null);
        try {
            const data = await apiFetch(`/dashboard/admin/payments/${id}`);
            setSelected(data);
        } catch (e: any) {
            console.error(e);
            setErrorMsg(e?.message || 'Gagal memuat detail');
        } finally {
            setDetailLoading(false);
        }
    };

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        window.location.href = `/dashboard/admin/payments/export?${params.toString()}`;
    };

    return (
        <AppLayout>
            <Head title="Payments" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Payments</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 flex items-center gap-2">
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search order/event/payload" className="input" />
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    refresh();
                                }}
                                className="input"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <Button
                                onClick={() => {
                                    refresh();
                                }}
                            >
                                Apply
                            </Button>
                            <Button onClick={exportCsv}>Export CSV</Button>
                        </div>

                        {errorMsg && <div className="mb-2 rounded bg-red-50 p-2 text-red-700">{errorMsg}</div>}

                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Event ID</TableHead>
                                        <TableHead>Processed At</TableHead>
                                        <TableHead>Payload</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingNotifications ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center">
                                                Loading notifications…
                                            </TableCell>
                                        </TableRow>
                                    ) : notifications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center">
                                                No notifications
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        notifications.map((n) => (
                                            <TableRow key={n.id} className="hover:bg-gray-50">
                                                <TableCell>{n.id}</TableCell>
                                                <TableCell>{n.provider}</TableCell>
                                                <TableCell>{n.order_id}</TableCell>
                                                <TableCell>{n.provider_event_id}</TableCell>
                                                <TableCell>{n.processed_at ?? '—'}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => openDetail(n.id)} disabled={detailLoading}>
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-2 flex gap-2">
                            <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1 || isLoadingNotifications}>
                                Prev
                            </Button>
                            <div>
                                Page {page} / {totalPages}
                            </div>
                            <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages || isLoadingNotifications}>
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Package</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Period</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptions.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.id}</TableCell>
                                            <TableCell>{s.user?.name ?? s.user?.email ?? '—'}</TableCell>
                                            <TableCell>{s.package?.name ?? '—'}</TableCell>
                                            <TableCell>{s.status}</TableCell>
                                            <TableCell>{s.midtrans_order_id ?? '—'}</TableCell>
                                            <TableCell>{s.midtrans_transaction_id ?? '—'}</TableCell>
                                            <TableCell>{s.starts_at ? `${s.starts_at} → ${s.ends_at}` : '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {selected && (
                    <div className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-black">
                        <div className="max-h-[80vh] w-3/4 overflow-auto rounded bg-white p-4 shadow-lg">
                            <h3 className="text-lg font-semibold">Notification {selected.id}</h3>
                            <div className="mt-2 text-sm">
                                <div>
                                    <strong>Provider:</strong> {selected.provider}
                                </div>
                                <div>
                                    <strong>Order ID:</strong> {selected.order_id}
                                </div>
                                <div>
                                    <strong>Event ID:</strong> {selected.provider_event_id}
                                </div>
                                <div>
                                    <strong>Processed At:</strong> {selected.processed_at ?? '—'}
                                </div>
                                <div className="mt-2">
                                    <strong>Payload:</strong>
                                    <pre className="overflow-auto text-xs">{JSON.stringify(selected.payload, null, 2)}</pre>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setSelected(null)}>
                                    Close
                                </Button>
                                <Button
                                    onClick={async () => {
                                        if (!selected) return;
                                        if (!confirm('Replay this notification and reprocess?')) return;
                                        setDetailLoading(true);
                                        setErrorMsg(null);
                                        try {
                                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                            const res = await fetch(`/dashboard/admin/payments/${selected.id}/replay`, {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                    'X-CSRF-TOKEN': token,
                                                },
                                                credentials: 'same-origin',
                                            });
                                            if (!res.ok) {
                                                const text = await res.text();
                                                throw new Error(text || res.statusText);
                                            }
                                            const data = await res.json();
                                            // refresh detail and lists
                                            await openDetail(selected.id);
                                            pushToast(data.message ? String(data.message) : 'Replay succeeded', 'success');
                                        } catch (e: any) {
                                            console.error(e);
                                            setErrorMsg(e?.message || 'Replay failed');
                                            pushToast(e?.message || 'Replay failed', 'error');
                                        } finally {
                                            setDetailLoading(false);
                                        }
                                    }}
                                >
                                    Replay
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Toast container */}
                <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
                    {toasts.map((t) => (
                        <div
                            key={t.id}
                            className={`max-w-xs rounded px-4 py-2 text-sm shadow-lg ${t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`}
                        >
                            {t.message}
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
