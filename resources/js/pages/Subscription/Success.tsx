import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    order_id?: string;
    transaction_id?: string;
}

export default function SubscriptionSuccess({ order_id, transaction_id }: Props) {
    return (
        <AppLayout>
            <Head title="Pembayaran Berhasil" />

            <div className="py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg 
                                    className="h-6 w-6 text-green-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Pembayaran Berhasil!
                            </h1>
                            
                            <p className="text-gray-600 mb-6">
                                Terima kasih! Subscription Anda telah aktif dan siap digunakan.
                            </p>

                            {order_id && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-600">Order ID:</p>
                                    <p className="font-mono text-sm font-medium">{order_id}</p>
                                    {transaction_id && (
                                        <>
                                            <p className="text-sm text-gray-600 mt-2">Transaction ID:</p>
                                            <p className="font-mono text-sm font-medium">{transaction_id}</p>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <Link
                                    href={route('dashboard')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Kembali ke Dashboard
                                </Link>
                                
                                <Link
                                    href={route('subscription.history')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Lihat Riwayat Subscription
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}