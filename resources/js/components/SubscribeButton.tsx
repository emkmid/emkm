import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SubscribeButton({ packageId }: { packageId: number }) {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        try {
            const res = await fetch('/subscriptions/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ package_id: packageId }),
            });
            // If user is not authenticated, server may redirect to login or return 401.
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }

            // If server returned HTML (redirect to login), try to detect and redirect
            const contentType = res.headers.get('content-type') || '';
            if (!res.ok && contentType.includes('text/html')) {
                // assume redirect to login
                window.location.href = '/login';
                return;
            }

            const data = await res.json();
            // Midtrans Snap flow
            if (data.snap_token) {
                const clientKey = data.client_key;
                const scriptSrc = data.is_production
                    ? `https://app.midtrans.com/snap/snap.js?client-key=${clientKey}`
                    : `https://app.sandbox.midtrans.com/snap/snap.js?client-key=${clientKey}`;

                // Load Snap.js if not already loaded
                await new Promise<void>((resolve, reject) => {
                    if ((window as any).snap) return resolve();
                    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
                    if (existing) return resolve();
                    const s = document.createElement('script');
                    s.src = scriptSrc;
                    s.onload = () => resolve();
                    s.onerror = () => reject(new Error('Failed to load Midtrans Snap script'));
                    document.head.appendChild(s);
                });

                (window as any).snap.pay(data.snap_token, {
                    onSuccess: function(result: any) {
                        alert('Pembayaran berhasil. Terima kasih!');
                        // Optionally refresh page or fetch subscription status
                        window.location.reload();
                    },
                    onPending: function(result: any) {
                        alert('Pembayaran pending. Silakan selesaikan pembayaran.');
                        window.location.reload();
                    },
                    onError: function(result: any) {
                        alert('Terjadi kesalahan pada pembayaran.');
                    },
                    onClose: function() {
                        // user closed the popup without finishing
                    }
                });
            } else if (data.manual) {
                alert('Subscription created (manual).');
            } else if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Unexpected response from server');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to start checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={onClick} disabled={loading} size="sm">
            {loading ? 'Processing...' : 'Subscribe'}
        </Button>
    );
}
