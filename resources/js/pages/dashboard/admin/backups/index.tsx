import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Database, 
    Download, 
    Trash2, 
    RefreshCw, 
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/dashboard/admin' },
    { title: 'Backups', href: '/dashboard/admin/backups' },
];

interface Backup {
    id: number;
    filename: string;
    path: string;
    size: number;
    formatted_size: string;
    type: string;
    created_by: number;
    creator: { name: string; email: string };
    description: string | null;
    status: 'pending' | 'completed' | 'failed';
    error_message: string | null;
    completed_at: string | null;
    created_at: string;
}

interface BackupsPageProps {
    backups: {
        data: Backup[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function BackupsIndex({ backups }: BackupsPageProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, processing } = useForm({
        description: '',
    });

    const handleCreateBackup = () => {
        setIsCreating(true);
        post(route('admin.backups.create'), {
            onSuccess: () => {
                setShowCreateDialog(false);
                setData('description', '');
                setIsCreating(false);
            },
            onError: () => {
                setIsCreating(false);
            },
        });
    };

    const handleDownload = (backup: Backup) => {
        window.location.href = route('admin.backups.download', backup.id);
    };

    const handleRestore = () => {
        if (!selectedBackup) return;

        router.post(
            route('admin.backups.restore', selectedBackup.id),
            {},
            {
                onSuccess: () => {
                    setShowRestoreDialog(false);
                    setSelectedBackup(null);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!selectedBackup) return;

        router.delete(route('admin.backups.destroy', selectedBackup.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setSelectedBackup(null);
            },
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClass = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
        
        switch (status) {
            case 'completed':
                return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case 'failed':
                return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            case 'pending':
                return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            default:
                return baseClass;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database Backups" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Database Backups</h1>
                        <p className="text-muted-foreground">
                            Kelola backup database untuk keamanan data
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Database className="mr-2 h-4 w-4" />
                        Buat Backup Baru
                    </Button>
                </div>

                {/* Warning Card */}
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <CardTitle className="text-yellow-900 dark:text-yellow-100">Peringatan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-yellow-800 dark:text-yellow-200">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Backup database secara berkala untuk mencegah kehilangan data</li>
                            <li>Simpan file backup di tempat yang aman (download ke komputer lokal)</li>
                            <li>Restore database akan menimpa data yang ada saat ini</li>
                            <li>Pastikan tidak ada user yang aktif saat melakukan restore</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Backups List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Backup</CardTitle>
                        <CardDescription>
                            Total {backups.total} backup tersedia
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {backups.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Belum ada backup</h3>
                                <p className="text-muted-foreground">
                                    Buat backup pertama Anda untuk mengamankan data
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {backups.data.map((backup) => (
                                    <div
                                        key={backup.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            {getStatusIcon(backup.status)}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{backup.filename}</p>
                                                    <span className={getStatusBadge(backup.status)}>
                                                        {backup.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {backup.description || 'No description'}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span>Size: {backup.formatted_size}</span>
                                                    <span>•</span>
                                                    <span>Created: {formatDate(backup.created_at)}</span>
                                                    <span>•</span>
                                                    <span>By: {backup.creator.name}</span>
                                                </div>
                                                {backup.error_message && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        Error: {backup.error_message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {backup.status === 'completed' && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(backup)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBackup(backup);
                                                        setShowRestoreDialog(true);
                                                    }}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBackup(backup);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Backup Dialog */}
            <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Buat Backup Database</AlertDialogTitle>
                        <AlertDialogDescription>
                            Backup akan mencakup seluruh database. Proses ini mungkin memakan waktu beberapa menit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Contoh: Backup sebelum update besar"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCreating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCreateBackup}
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating...' : 'Buat Backup'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Restore Dialog */}
            <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Restore Database
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong className="text-red-600">PERINGATAN:</strong> Tindakan ini akan menimpa database yang ada dengan data dari backup.
                            Semua perubahan yang dibuat setelah backup ini akan hilang.
                            <br /><br />
                            Backup yang akan di-restore: <strong>{selectedBackup?.filename}</strong>
                            <br />
                            Dibuat: <strong>{selectedBackup && formatDate(selectedBackup.created_at)}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRestore}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Restore Database
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Backup</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus backup ini? File backup akan dihapus permanent dan tidak dapat dikembalikan.
                            <br /><br />
                            File: <strong>{selectedBackup?.filename}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
