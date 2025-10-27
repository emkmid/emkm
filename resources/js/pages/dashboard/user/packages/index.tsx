import PackagesList from '@/components/PackagesList';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AppLayout>
            <Head title="Paket Layanan" />

            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Paket Layanan</h1>
                <PackagesList />
            </div>
        </AppLayout>
    );
}
