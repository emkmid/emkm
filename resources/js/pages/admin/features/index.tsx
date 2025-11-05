import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Trash2, Save, X, CheckCircle2, XCircle } from 'lucide-react';

// Simple Switch component (since we don't have shadcn switch)
const Switch = ({ checked, onCheckedChange, disabled }: { 
    checked: boolean; 
    onCheckedChange: (checked: boolean) => void; 
    disabled?: boolean;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${checked ? 'bg-primary' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
    >
        <span
            className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
        />
    </button>
);

interface Package {
    id: number;
    name: string;
    price: number;
}

interface PackageFeature {
    id: number;
    feature_key: string;
    feature_name: string;
    description: string | null;
    category: string;
    limit_type: 'boolean' | 'numeric' | 'list';
    sort_order: number;
}

interface FeatureLimit {
    is_enabled: boolean;
    numeric_limit: number | null;
    list_values: string | null;
}

interface FeatureMatrix {
    [featureId: number]: {
        feature: PackageFeature;
        limits: {
            [packageId: number]: FeatureLimit | null;
        };
    };
}

interface Props {
    packages: Package[];
    features: { [category: string]: PackageFeature[] };
    featureMatrix: FeatureMatrix;
}

export default function Index({ packages, features, featureMatrix }: Props) {
    const [editingCell, setEditingCell] = useState<{
        featureId: number;
        packageId: number;
        limit: FeatureLimit | null;
    } | null>(null);
    
    const [tempValue, setTempValue] = useState<string>('');
    const [tempEnabled, setTempEnabled] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

    const categoryColors: { [key: string]: string } = {
        accounting: 'bg-blue-100 text-blue-800',
        articles: 'bg-purple-100 text-purple-800',
        invoices: 'bg-green-100 text-green-800',
        customers: 'bg-orange-100 text-orange-800',
        others: 'bg-gray-100 text-gray-800',
    };

    const handleEditCell = (featureId: number, packageId: number, currentLimit: FeatureLimit | null) => {
        const feature = featureMatrix[featureId].feature;
        
        setEditingCell({ featureId, packageId, limit: currentLimit });
        setTempEnabled(currentLimit?.is_enabled ?? false);
        
        if (feature.limit_type === 'numeric') {
            setTempValue(currentLimit?.numeric_limit?.toString() ?? '');
        } else {
            setTempValue('');
        }
    };

    const handleSaveCell = async () => {
        if (!editingCell) return;

        setIsSaving(true);

        const feature = featureMatrix[editingCell.featureId].feature;
        
        const data = {
            package_id: editingCell.packageId,
            feature_id: editingCell.featureId,
            is_enabled: tempEnabled,
            numeric_limit: feature.limit_type === 'numeric' && tempValue ? parseInt(tempValue) : null,
            list_values: feature.limit_type === 'list' ? tempValue : null,
        };

        try {
            await router.post(route('admin.features.update-limit'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Limit berhasil diupdate');
                    setEditingCell(null);
                },
                onError: () => {
                    alert('Gagal mengupdate limit');
                },
                onFinish: () => {
                    setIsSaving(false);
                },
            });
        } catch (error) {
            alert('Terjadi kesalahan');
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
        setTempValue('');
        setTempEnabled(false);
    };

    const handleDelete = async (featureId: number) => {
        router.delete(route('admin.features.destroy', featureId), {
            preserveScroll: true,
            onSuccess: () => {
                alert('Feature berhasil dihapus');
                setDeleteDialog(null);
            },
            onError: () => {
                alert('Gagal menghapus feature');
            },
        });
    };

    const renderLimitCell = (
        feature: PackageFeature,
        packageId: number,
        limit: FeatureLimit | null
    ) => {
        const isEditing =
            editingCell?.featureId === feature.id &&
            editingCell?.packageId === packageId;

        if (isEditing) {
            return (
                <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={tempEnabled}
                            onCheckedChange={setTempEnabled}
                            disabled={isSaving}
                        />
                        <span className="text-xs font-medium">
                            {tempEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    
                    {feature.limit_type === 'numeric' && tempEnabled && (
                        <Input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="-1 = Unlimited"
                            className="w-32 h-8 text-center"
                            disabled={isSaving}
                        />
                    )}

                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            onClick={handleSaveCell}
                            disabled={isSaving}
                            className="h-7 px-2"
                        >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="h-7 px-2"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>
            );
        }

        const isEnabled = limit?.is_enabled ?? false;
        const numericLimit = limit?.numeric_limit;

        return (
            <div
                className="flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                onClick={() => handleEditCell(feature.id, packageId, limit)}
            >
                {isEnabled ? (
                    <>
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        {feature.limit_type === 'numeric' && (
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                    {numericLimit === null || numericLimit === -1
                                        ? '∞'
                                        : numericLimit}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {numericLimit === null || numericLimit === -1
                                        ? 'Unlimited'
                                        : 'limit'}
                                </div>
                            </div>
                        )}
                        {feature.limit_type === 'boolean' && (
                            <span className="text-xs font-medium text-green-700">
                                Enabled
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        <XCircle className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500">
                            Disabled
                        </span>
                    </>
                )}
                <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to edit
                </div>
            </div>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: route('admin.dashboard') },
                { title: 'Features', href: route('admin.features.index') },
            ]}
        >
            <Head title="Package Features" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Package Features</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Kelola fitur dan batasan untuk setiap paket berlangganan
                        </p>
                    </div>
                    <Link href={route('admin.features.create')}>
                        <Button size="lg">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Feature
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Features</CardDescription>
                            <CardTitle className="text-3xl">
                                {Object.values(features).flat().length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Categories</CardDescription>
                            <CardTitle className="text-3xl">
                                {Object.keys(features).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Active Packages</CardDescription>
                            <CardTitle className="text-3xl">
                                {packages.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Limits</CardDescription>
                            <CardTitle className="text-3xl">
                                {Object.values(featureMatrix).reduce((acc, f) => 
                                    acc + Object.keys(f.limits).length, 0
                                )}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Feature Matrix</CardTitle>
                        <CardDescription>
                            Klik pada cell untuk edit limits. Toggle enable/disable dan atur numeric limits.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {Object.entries(features).map(([category, categoryFeatures]) => (
                            <div key={category} className="border-b last:border-b-0">
                                <div className="bg-gray-50 px-6 py-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Badge className={categoryColors[category] || categoryColors.others}>
                                            {category.toUpperCase()}
                                        </Badge>
                                        <span className="text-sm text-gray-600">
                                            {categoryFeatures.length} features
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-white">
                                                <TableHead className="w-[350px] font-semibold">Feature</TableHead>
                                                {packages.map((pkg) => (
                                                    <TableHead key={pkg.id} className="text-center min-w-[160px]">
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-base">{pkg.name}</div>
                                                            <div className="text-xs font-normal text-muted-foreground">
                                                                {pkg.price === 0
                                                                    ? 'Gratis'
                                                                    : `Rp ${pkg.price.toLocaleString('id-ID')}/bulan`}
                                                            </div>
                                                        </div>
                                                    </TableHead>
                                                ))}
                                                <TableHead className="w-[120px] text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoryFeatures.map((feature) => {
                                                const matrix = featureMatrix[feature.id];
                                                
                                                return (
                                                    <TableRow key={feature.id} className="hover:bg-gray-50">
                                                        <TableCell className="align-top">
                                                            <div className="space-y-2">
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {feature.feature_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 font-mono">
                                                                        {feature.feature_key}
                                                                    </div>
                                                                </div>
                                                                {feature.description && (
                                                                    <div className="text-xs text-gray-600 leading-relaxed">
                                                                        {feature.description}
                                                                    </div>
                                                                )}
                                                                <Badge variant="outline" className="text-xs">
                                                                    {feature.limit_type}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>

                                                        {packages.map((pkg) => (
                                                            <TableCell key={pkg.id} className="text-center align-top bg-white">
                                                                {renderLimitCell(
                                                                    feature,
                                                                    pkg.id,
                                                                    matrix.limits[pkg.id]
                                                                )}
                                                            </TableCell>
                                                        ))}

                                                        <TableCell className="text-center align-top">
                                                            <div className="flex gap-1 justify-center">
                                                                <Link
                                                                    href={route('admin.features.edit', feature.id)}
                                                                >
                                                                    <Button size="sm" variant="ghost" title="Edit">
                                                                        <Pencil className="h-4 w-4 text-blue-600" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setDeleteDialog(feature.id)}
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hapus Feature</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus feature ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => deleteDialog && handleDelete(deleteDialog)}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
