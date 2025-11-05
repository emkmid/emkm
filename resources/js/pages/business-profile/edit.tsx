import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface BusinessProfile {
    id: number;
    business_name: string;
    owner_name: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
    tax_number: string | null;
    business_type: string | null;
    logo_path: string | null;
    description: string | null;
    logo_url: string | null;
}

interface Props {
    profile: BusinessProfile;
}

export default function EditBusinessProfile({ profile }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.logo_url);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        business_name: profile.business_name || '',
        owner_name: profile.owner_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'Indonesia',
        tax_number: profile.tax_number || '',
        business_type: profile.business_type || '',
        description: profile.description || '',
        logo: null as File | null,
        _method: 'POST',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('business-profile.update'), {
            forceFormData: true,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearLogo = () => {
        setData('logo', null);
        setPreviewUrl(profile.logo_url);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('business-profile.destroy'), {
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Profil Bisnis" />

            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('business-profile.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Profil Bisnis</h1>
                            <p className="text-muted-foreground mt-1">
                                Perbarui informasi bisnis Anda
                            </p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="lg">
                                <Trash2 className="mr-2 h-5 w-5" />
                                Hapus Profil
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Profil Bisnis?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Profil bisnis Anda akan dihapus secara
                                    permanen dari sistem.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Logo Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo Bisnis</CardTitle>
                                <CardDescription>
                                    Upload logo bisnis Anda (opsional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-6">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Logo preview"
                                                className="h-32 w-32 object-contain rounded-lg border-2 border-border"
                                            />
                                            {data.logo && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={clearLogo}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-32 w-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {previewUrl ? 'Ganti Logo' : 'Upload Logo'}
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            PNG, JPG, atau GIF (max. 2MB)
                                        </p>
                                        {errors.logo && (
                                            <p className="text-sm text-destructive">{errors.logo}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Informasi utama tentang bisnis Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business_name">
                                        Nama Bisnis <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="business_name"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        placeholder="PT. Contoh Bisnis Indonesia"
                                        required
                                    />
                                    {errors.business_name && (
                                        <p className="text-sm text-destructive">{errors.business_name}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="owner_name">Nama Pemilik</Label>
                                        <Input
                                            id="owner_name"
                                            value={data.owner_name}
                                            onChange={(e) => setData('owner_name', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                        {errors.owner_name && (
                                            <p className="text-sm text-destructive">{errors.owner_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_type">Jenis Bisnis</Label>
                                        <Select
                                            value={data.business_type}
                                            onValueChange={(value) => setData('business_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis bisnis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="retail">Retail</SelectItem>
                                                <SelectItem value="wholesale">Wholesale</SelectItem>
                                                <SelectItem value="service">Jasa</SelectItem>
                                                <SelectItem value="manufacturing">Manufaktur</SelectItem>
                                                <SelectItem value="food">Makanan & Minuman</SelectItem>
                                                <SelectItem value="technology">Teknologi</SelectItem>
                                                <SelectItem value="other">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.business_type && (
                                            <p className="text-sm text-destructive">{errors.business_type}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tax_number">NPWP / Tax Number</Label>
                                    <Input
                                        id="tax_number"
                                        value={data.tax_number}
                                        onChange={(e) => setData('tax_number', e.target.value)}
                                        placeholder="00.000.000.0-000.000"
                                    />
                                    {errors.tax_number && (
                                        <p className="text-sm text-destructive">{errors.tax_number}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Bisnis</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Deskripsi singkat tentang bisnis Anda..."
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Kontak</CardTitle>
                                <CardDescription>
                                    Cara menghubungi bisnis Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="info@bisnis.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telepon</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://www.bisnis.com"
                                    />
                                    {errors.website && (
                                        <p className="text-sm text-destructive">{errors.website}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Alamat</CardTitle>
                                <CardDescription>
                                    Lokasi fisik bisnis Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat Lengkap</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Jl. Contoh No. 123"
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-destructive">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Kota</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Jakarta"
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-destructive">{errors.city}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">Provinsi</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="DKI Jakarta"
                                        />
                                        {errors.state && (
                                            <p className="text-sm text-destructive">{errors.state}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="postal_code">Kode Pos</Label>
                                        <Input
                                            id="postal_code"
                                            value={data.postal_code}
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                            placeholder="12345"
                                        />
                                        {errors.postal_code && (
                                            <p className="text-sm text-destructive">{errors.postal_code}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Negara</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="Indonesia"
                                        />
                                        {errors.country && (
                                            <p className="text-sm text-destructive">{errors.country}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" size="lg" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href={route('business-profile.index')}>Batal</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
