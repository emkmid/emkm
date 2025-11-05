/**
 * EXAMPLE: Invoice Create dengan Feature Limits
 * 
 * Cara menggunakan feature limits di halaman invoice create
 */

import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuotaDisplay, UpgradePrompt, LimitReachedAlert } from '@/components/feature-limits';
import { ArrowLeft, Plus } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    display_name: string;
}

interface Quota {
    current: number;
    limit: number;
    remaining: number;
    is_unlimited: boolean;
}

interface Props {
    customers: Customer[];
    quota: Quota;
}

export default function InvoiceCreateExample({ customers, quota }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        items: [],
    });

    // Check if limit reached
    const limitReached = quota.remaining === 0 && !quota.is_unlimited;

    return (
        <AppLayout>
            <Head title="Buat Invoice" />

            <div className="container max-w-6xl mx-auto py-6 space-y-8">
                {/* Header dengan Quota Display */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Button variant="ghost" size="sm" asChild className="mb-2">
                            <Link href={route('invoices.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Buat Invoice</h1>
                        <p className="text-muted-foreground mt-1">
                            Buat invoice baru untuk customer
                        </p>
                    </div>
                    
                    {/* Display Quota */}
                    <Card className="sm:w-auto">
                        <CardContent className="pt-6">
                            <QuotaDisplay
                                current={quota.current}
                                limit={quota.limit}
                                remaining={quota.remaining}
                                isUnlimited={quota.is_unlimited}
                                featureName="Invoice"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Alert jika limit tercapai */}
                {limitReached && (
                    <LimitReachedAlert
                        featureName="invoice"
                        currentLimit={quota.limit}
                        nextPackage="Pro"
                        nextLimit="Unlimited"
                    />
                )}

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {limitReached ? (
                            /* Show upgrade prompt if limit reached */
                            <UpgradePrompt
                                feature="Unlimited Invoices"
                                requiredPackage="Pro"
                                price={59000}
                                benefits={[
                                    'Unlimited invoice per bulan',
                                    'Kirim invoice via email',
                                    'Unlimited customer',
                                    'Priority support',
                                ]}
                            />
                        ) : (
                            /* Show form if quota available */
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Invoice</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        post(route('invoices.store'));
                                    }}>
                                        {/* Form fields here */}
                                        <p className="text-muted-foreground">Form invoice...</p>
                                        
                                        {/* Submit Button */}
                                        <div className="mt-6 flex gap-3">
                                            <Button 
                                                type="submit" 
                                                disabled={processing || limitReached}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Buat Invoice
                                            </Button>
                                            
                                            {/* Warning jika hampir limit */}
                                            {!quota.is_unlimited && quota.remaining <= 5 && quota.remaining > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                                    <span>
                                                        Hanya {quota.remaining} invoice tersisa bulan ini
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Feature Benefits */}
                    <div className="space-y-4">
                        {!quota.is_unlimited && (
                            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        💡 Tips: Butuh Lebih Banyak Invoice?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p>Upgrade ke paket Pro untuk:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Unlimited invoice</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Email invoice ke customer</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span>Unlimited transaksi</span>
                                        </li>
                                    </ul>
                                    <Button asChild size="sm" className="w-full mt-4">
                                        <Link href={route('packages.index')}>
                                            Lihat Paket Pro
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
