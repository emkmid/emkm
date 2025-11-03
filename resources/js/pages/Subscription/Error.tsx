import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function SubscriptionError() {
    return (
        <AppLayout>
            <Head title="Pembayaran Gagal" />

            <div className="py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg 
                                    className="h-6 w-6 text-red-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Pembayaran Gagal
                            </h1>
                            
                            <p className="text-gray-600 mb-6">
                                Maaf, pembayaran Anda tidak dapat diproses atau dibatalkan.
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href={route('dashboard.packages')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Coba Lagi
                                </Link>
                                
                                <Link
                                    href={route('dashboard')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Kembali ke Dashboard
                                </Link>
                            </div>

                            <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    Mengapa pembayaran gagal?
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Saldo atau limit kartu tidak mencukupi</li>
                                    <li>• Koneksi internet terputus</li>
                                    <li>• Pembayaran dibatalkan</li>
                                    <li>• Terjadi kesalahan teknis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}