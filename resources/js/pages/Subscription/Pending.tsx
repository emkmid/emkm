import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    order_id?: string;
    message?: string;
}

export default function SubscriptionPending({ order_id, message }: Props) {
    return (
        <AppLayout>
            <Head title="Pembayaran Menunggu" />

            <div className="py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                <svg 
                                    className="h-6 w-6 text-yellow-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Pembayaran Sedang Diproses
                            </h1>
                            
                            <p className="text-gray-600 mb-6">
                                {message || 'Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi.'}
                            </p>

                            {order_id && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-600">Order ID:</p>
                                    <p className="font-mono text-sm font-medium">{order_id}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Link
                                    href={route('subscription.history')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cek Status Pembayaran
                                </Link>
                                
                                <Link
                                    href={route('dashboard')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Kembali ke Dashboard
                                </Link>
                            </div>

                            <div className="mt-6 text-left bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-900 mb-2">
                                    Informasi Penting
                                </h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Jangan menutup browser sampai pembayaran selesai</li>
                                    <li>• Proses pembayaran dapat memakan waktu beberapa menit</li>
                                    <li>• Anda akan mendapat notifikasi email setelah pembayaran berhasil</li>
                                    <li>• Simpan Order ID untuk referensi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}