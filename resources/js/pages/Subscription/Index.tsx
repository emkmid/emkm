import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, Subscription } from '@/types';

interface Props {
    packages: Package[];
    userSubscription?: Subscription;
    pendingPayment?: {
        subscription_id: number;
        package_name: string;
        amount: number;
        order_id: string;
        snap_token?: string;
        created_at: string;
    };
    checkoutData?: {
        snap_token: string;
        order_id: string;
        client_key: string;
        is_production: boolean;
        subscription_id: number;
    };
}

interface DurationOption {
    value: string;
    label: string;
    discount?: number;
}

export default function SubscriptionIndex({ packages, userSubscription, pendingPayment, checkoutData }: Props) {
    const { flash, errors } = usePage().props as any;
    const [loading, setLoading] = useState<string | null>(null);
    const [selectedDurations, setSelectedDurations] = useState<{ [key: number]: string }>({});
    const [error, setError] = useState<string>('');
    const [showPendingModal, setShowPendingModal] = useState(!!pendingPayment);

    // Handle checkout data from props (direct from controller)
    useEffect(() => {
        if (checkoutData) {
            console.log('=== CHECKOUT DATA FROM PROPS ===');
            console.log('CheckoutData received:', checkoutData);
            handleMidtransCheckout(checkoutData);
        }
    }, [checkoutData]);

    // Handle checkout data from flash session
    useEffect(() => {
        console.log('=== FLASH DATA CHECK ===');
        console.log('Flash object:', flash);
        console.log('Flash keys:', Object.keys(flash || {}));
        console.log('Flash.checkoutData:', flash?.checkoutData);
        console.log('All flash values:', JSON.stringify(flash, null, 2));
        
        if (flash?.checkoutData) {
            console.log('Processing checkout data from flash...');
            handleMidtransCheckout(flash.checkoutData);
        } else {
            console.log('No checkout data in flash');
            
            // Check if checkoutData is in a different location
            for (const [key, value] of Object.entries(flash || {})) {
                if (typeof value === 'object' && value !== null && 'snap_token' in value) {
                    console.log(`Found potential checkoutData in flash.${key}:`, value);
                    handleMidtransCheckout(value);
                    return;
                }
            }
        }
    }, [flash]);

    // Handle error from Inertia redirect
    useEffect(() => {
        if (errors?.subscription) {
            setError(errors.subscription);
        }
    }, [errors]);

    const durationOptions: DurationOption[] = [
        { value: '1_month', label: '1 Bulan' },
        { value: '3_months', label: '3 Bulan', discount: 5 },
        { value: '6_months', label: '6 Bulan', discount: 10 },
        { value: '1_year', label: '1 Tahun', discount: 15 },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const calculateDiscountedPrice = (pkg: Package, duration: string) => {
        const basePrice = pkg.price;
        const durationMultipliers: { [key: string]: number } = {
            '1_month': 1,
            '3_months': 3,
            '6_months': 6,
            '1_year': 12,
        };

        const discountMultipliers: { [key: string]: number } = {
            '1_month': 1.0,
            '3_months': 0.95,
            '6_months': 0.90,
            '1_year': 0.85,
        };

        const periodMultiplier = durationMultipliers[duration] || 1;
        const discountMultiplier = discountMultipliers[duration] || 1.0;
        
        // Apply package-specific discount
        const additionalDiscount = pkg.discount_percentage ? (pkg.discount_percentage / 100) : 0;
        const finalMultiplier = discountMultiplier - additionalDiscount;

        return basePrice * periodMultiplier * finalMultiplier;
    };

    const loadMidtransSnap = async (checkoutData: any) => {
        console.log('=== LOADING MIDTRANS SNAP ===');
        console.log('Client key:', checkoutData.client_key);
        console.log('Is production:', checkoutData.is_production);
        
        return new Promise<void>((resolve, reject) => {
            // Remove existing Midtrans script if present
            const existingScript = document.getElementById('midtrans-script');
            if (existingScript) {
                console.log('Removing existing Midtrans script');
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.id = 'midtrans-script';
            script.src = checkoutData.is_production 
                ? 'https://app.midtrans.com/snap/snap.js' 
                : 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', checkoutData.client_key);
            
            console.log('Script URL:', script.src);
            console.log('Client key attribute:', checkoutData.client_key);
            
            script.onload = () => {
                console.log('Midtrans script loaded successfully');
                console.log('Window.snap available:', !!(window as any).snap);
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('Failed to load Midtrans script:', error);
                reject(new Error('Failed to load Midtrans Snap script'));
            };
            
            document.head.appendChild(script);
            console.log('Midtrans script added to document head');
        });
    };

    const handleSubscribe = async (pkg: Package) => {
        const duration = selectedDurations[pkg.id] || '1_month';
        setLoading(pkg.id.toString());
        setError('');

        try {
            // Handle free package separately
            if (pkg.price === 0) {
                // Call free package activation endpoint
                router.post('/subscriptions/activate-free', {
                    package_id: pkg.id,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log('Free package activated successfully');
                    },
                    onError: (errors: any) => {
                        console.error('Free package activation error:', errors);
                        if (errors.error_code === 'ACTIVE_SUBSCRIPTION_EXISTS') {
                            setError('Anda sudah memiliki subscription aktif.');
                        } else {
                            setError(errors.message || 'Gagal mengaktivasi package gratis.');
                        }
                    },
                    onFinish: () => {
                        setLoading(null);
                    }
                });
                return;
            }

            // Validate package and duration
            if (!pkg.duration_options || !pkg.duration_options.includes(duration)) {
                throw new Error(`Duration tidak tersedia untuk paket ini. Available: ${JSON.stringify(pkg.duration_options)}`);
            }

            console.log('Starting subscription for package:', pkg.name, 'duration:', duration);
            console.log('Package price:', pkg.price);
            console.log('Package is active:', pkg.is_active);

            // Use Inertia router for CSRF-protected POST request
            router.post('/subscriptions/checkout', {
                package_id: pkg.id,
                duration: duration,
            }, {
                preserveState: false, // Allow full page reload with new props
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Subscription request successful - waiting for page reload with checkoutData');
                },
                onError: (errors: any) => {
                    console.error('Checkout error:', errors);
                    
                    if (errors.error_code) {
                        switch (errors.error_code) {
                            case 'ACTIVE_SUBSCRIPTION_EXISTS':
                                setError(`Anda sudah memiliki subscription aktif (${errors.data?.current_subscription?.package_name || 'Unknown'})`);
                                break;
                            case 'RECENT_PENDING_PAYMENT':
                                setError('Anda memiliki pembayaran yang sedang diproses. Silakan tunggu beberapa menit.');
                                break;
                            case 'PACKAGE_INACTIVE':
                                setError('Paket ini sedang tidak tersedia.');
                                break;
                            case 'INVALID_DURATION':
                                setError('Durasi yang dipilih tidak tersedia untuk paket ini.');
                                break;
                            case 'VALIDATION_ERROR':
                                const errorMessages = Object.values(errors.errors || {}).flat();
                                setError(`Data tidak valid: ${errorMessages.join(', ')}`);
                                break;
                            default:
                                setError(errors.message || 'Gagal membuat pembayaran');
                        }
                    } else if (errors.message) {
                        setError(errors.message);
                    } else if (typeof errors === 'string') {
                        setError(errors);
                    } else {
                        setError('Terjadi kesalahan saat memproses pembayaran.');
                    }
                },
                onFinish: () => {
                    console.log('Request finished');
                    setLoading('');
                }
            });

        } catch (error: any) {
            console.error('Error in handleSubscribe:', error);
            setError(error.message || 'Terjadi kesalahan saat memproses pembayaran');
            setLoading('');
        }
    };

    const handleMidtransCheckout = async (checkoutData: any) => {
        console.log('=== MIDTRANS DEBUG ===');
        console.log('Checkout data received:', checkoutData);
        console.log('Snap token:', checkoutData.snap_token);
        console.log('Client key:', checkoutData.client_key);
        console.log('Is production:', checkoutData.is_production);
        
        try {
            console.log('Loading Midtrans Snap script...');
            await loadMidtransSnap(checkoutData);
            console.log('Midtrans Snap script loaded successfully');
            
            // Check if snap is available
            if (!(window as any).snap) {
                throw new Error('Midtrans Snap not available on window object');
            }
            
            console.log('Calling snap.pay with token:', checkoutData.snap_token);
            (window as any).snap.pay(checkoutData.snap_token, {
                onSuccess: (result: any) => {
                    console.log('Payment success:', result);
                    router.visit('/subscriptions/success', {
                        data: { transaction_id: result.order_id }
                    });
                },
                onPending: (result: any) => {
                    console.log('Payment pending:', result);
                    router.visit('/subscriptions/pending', {
                        data: { transaction_id: result.order_id }
                    });
                },
                onError: (result: any) => {
                    console.log('Payment error:', result);
                    // Handle specific error cases
                    if (result.status_code === '409') {
                        setError('Token pembayaran sudah expired. Silakan coba lagi.');
                    } else {
                        setError(`Pembayaran gagal: ${result.error_message || 'Unknown error'}`);
                    }
                },
                onClose: () => {
                    console.log('Payment modal closed');
                    setLoading(null);
                }
            });
        } catch (error: any) {
            console.error('Midtrans checkout error:', error);
            setError('Gagal memuat halaman pembayaran');
        }
    };

    const handleContinuePayment = async () => {
        if (!pendingPayment?.snap_token) {
            setError('Snap token tidak tersedia untuk melanjutkan pembayaran');
            return;
        }

        setLoading('continue-payment');
        try {
            await loadMidtransSnap({
                snap_token: pendingPayment.snap_token,
                client_key: 'your-client-key', // Will be provided by backend
                is_production: false
            });

            (window as any).snap.pay(pendingPayment.snap_token, {
                onSuccess: (result: any) => {
                    console.log('Payment success:', result);
                    router.visit('/subscriptions/success', {
                        data: { transaction_id: result.order_id }
                    });
                },
                onPending: (result: any) => {
                    console.log('Payment pending:', result);
                    router.visit('/subscriptions/pending', {
                        data: { transaction_id: result.order_id }
                    });
                },
                onError: (result: any) => {
                    console.log('Payment error:', result);
                    router.visit('/subscriptions/error', {
                        data: { message: 'Pembayaran gagal' }
                    });
                },
                onClose: () => {
                    console.log('Payment modal closed');
                    setShowPendingModal(true);
                }
            });
        } catch (error: any) {
            console.error('Continue payment error:', error);
            setError('Gagal melanjutkan pembayaran');
        } finally {
            setLoading(null);
        }
    };

    const handleCancelPayment = () => {
        if (!pendingPayment) return;

        setLoading('cancel-payment');
        router.post('/subscriptions/cancel-pending', {
            subscription_id: pendingPayment.subscription_id
        }, {
            onSuccess: () => {
                setShowPendingModal(false);
                setError('');
            },
            onError: (errors: any) => {
                setError('Gagal membatalkan pembayaran');
            },
            onFinish: () => {
                setLoading(null);
            }
        });
    };

    const handleDurationChange = (packageId: number, duration: string) => {
        setSelectedDurations(prev => ({
            ...prev,
            [packageId]: duration
        }));
    };

    const isActive = (status: string) => {
        return ['active', 'trialing'].includes(status);
    };

    const hasActiveSubscription = userSubscription && isActive(userSubscription.status);

    return (
        <AppLayout>
            <Head title="Paket Berlangganan" />
            
            {/* Load Midtrans Snap */}
            <script 
                src="https://app.sandbox.midtrans.com/snap/snap.js" 
                data-client-key={import.meta.env.VITE_MIDTRANS_CLIENT_KEY}
            />

            {/* Pending Payment Modal */}
            {showPendingModal && pendingPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Pembayaran Tertunda
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Anda memiliki pembayaran yang belum selesai untuk paket <strong>{pendingPayment.package_name}</strong> senilai <strong>{formatPrice(pendingPayment.amount)}</strong>.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleContinuePayment}
                                    disabled={loading === 'continue-payment'}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading === 'continue-payment' ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                                </button>
                                <button
                                    onClick={handleCancelPayment}
                                    disabled={loading === 'cancel-payment'}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {loading === 'cancel-payment' ? 'Membatalkan...' : 'Batalkan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                Pilih Paket Berlangganan
                            </h1>

                            {userSubscription && userSubscription.status === 'active' && (
                                <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                    <p className="font-medium">Anda sudah memiliki subscription aktif</p>
                                    <p className="text-sm">
                                        Paket: {userSubscription.package?.name} | 
                                        Berakhir: {userSubscription.ends_at ? new Date(userSubscription.ends_at).toLocaleDateString('id-ID') : 'Tidak terbatas'}
                                    </p>
                                </div>
                            )}

            {error && (
                <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {packages.map((pkg) => (
                                    <div 
                                        key={pkg.id} 
                                        className={`relative bg-white border-2 rounded-lg p-6 ${
                                            pkg.is_popular 
                                                ? 'border-blue-500 shadow-lg transform scale-105' 
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        {pkg.is_popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Terpopuler
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {pkg.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {pkg.description}
                                            </p>

                                            {pkg.name !== 'Free' && (
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Durasi
                                                    </label>
                                                    <select
                                                        value={selectedDurations[pkg.id] || '1_month'}
                                                        onChange={(e) => setSelectedDurations({
                                                            ...selectedDurations,
                                                            [pkg.id]: e.target.value
                                                        })}
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                    >
                                                        {durationOptions
                                                            .filter(option => (pkg.duration_options || ['1_month']).includes(option.value))
                                                            .map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                    {option.discount && ` (Hemat ${option.discount}%)`}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                {pkg.price === 0 ? (
                                                    <div className="text-3xl font-bold text-gray-900">
                                                        GRATIS
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-3xl font-bold text-gray-900">
                                                            {formatPrice(calculateDiscountedPrice(
                                                                pkg, 
                                                                selectedDurations[pkg.id] || '1_month'
                                                            ))}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            per {durationOptions.find(d => d.value === (selectedDurations[pkg.id] || '1_month'))?.label}
                                                        </div>
                                                        {pkg.discount_percentage > 0 && (
                                                            <div className="text-sm text-green-600 font-medium">
                                                                Diskon {pkg.discount_percentage}%
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <ul className="text-left mb-6 space-y-2">
                                                {Object.entries(pkg.features).map(([feature, enabled]) => (
                                                    <li 
                                                        key={feature}
                                                        className={`flex items-center ${
                                                            enabled ? 'text-gray-900' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        <svg 
                                                            className={`w-4 h-4 mr-2 ${
                                                                enabled ? 'text-green-500' : 'text-gray-300'
                                                            }`}
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path 
                                                                fillRule="evenodd" 
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                                clipRule="evenodd" 
                                                            />
                                                        </svg>
                                                        {feature === 'products' && 'Manajemen Produk'}
                                                        {feature === 'transactions' && 'Transaksi'}
                                                        {feature === 'reports' && 'Laporan'}
                                                        {feature === 'hpp' && 'Harga Pokok Penjualan'}
                                                        {feature === 'priority_support' && 'Support Prioritas'}
                                                        {feature === 'advanced_reports' && 'Laporan Lanjutan'}
                                                        {feature === 'api_access' && 'Akses API'}
                                                        {feature === 'white_label' && 'White Label'}
                                                        {feature === 'custom_integration' && 'Integrasi Custom'}
                                                        {typeof enabled === 'string' && `${feature}: ${enabled}`}
                                                        {typeof enabled === 'number' && `${feature}: ${enabled}`}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handleSubscribe(pkg)}
                                                disabled={
                                                    loading === pkg.id.toString() || 
                                                    (userSubscription?.status === 'active' && pkg.name !== 'Free')
                                                }
                                                className={`w-full py-2 px-4 rounded-md font-medium ${
                                                    pkg.is_popular
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-gray-800 hover:bg-gray-900 text-white'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {loading === pkg.id.toString() ? (
                                                    <div className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Memproses...
                                                    </div>
                                                ) : (
                                                    pkg.name === 'Free' ? 'Gunakan Gratis' : 'Berlangganan'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Mengapa Berlangganan?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Fitur Lengkap</h3>
                                        <p className="text-gray-600 text-sm">
                                            Akses ke semua fitur akuntansi dan manajemen bisnis yang Anda butuhkan.
                                        </p>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Support 24/7</h3>
                                        <p className="text-gray-600 text-sm">
                                            Tim support siap membantu Anda kapan saja untuk menyelesaikan masalah.
                                        </p>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Update Berkala</h3>
                                        <p className="text-gray-600 text-sm">
                                            Dapatkan fitur-fitur baru dan perbaikan bug secara otomatis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}