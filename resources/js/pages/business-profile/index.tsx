import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Building2, Edit, Mail, MapPin, Phone, Globe, FileText, Hash } from 'lucide-react';

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
    full_address: string | null;
}

interface Props {
    profile: BusinessProfile | null;
}

export default function BusinessProfileIndex({ profile }: Props) {
    return (
        <AppLayout>
            <Head title="Profil Bisnis" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Profil Bisnis</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola informasi bisnis Anda untuk invoice dan branding
                        </p>
                    </div>
                    {profile ? (
                        <Button asChild>
                            <Link href={route('business-profile.edit')}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profil
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href={route('business-profile.create')}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Buat Profil Bisnis
                            </Link>
                        </Button>
                    )}
                </div>

                {profile ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Logo & Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Informasi utama bisnis Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo */}
                                {profile.logo_url && (
                                    <div className="flex justify-center">
                                        <img
                                            src={profile.logo_url}
                                            alt={profile.business_name}
                                            className="h-32 w-32 object-contain rounded-lg border-2 border-border"
                                        />
                                    </div>
                                )}

                                {/* Business Name */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <Building2 className="h-4 w-4" />
                                        <span>Nama Bisnis</span>
                                    </div>
                                    <p className="font-semibold text-lg">{profile.business_name}</p>
                                </div>

                                {/* Owner Name */}
                                {profile.owner_name && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Nama Pemilik
                                        </div>
                                        <p className="font-medium">{profile.owner_name}</p>
                                    </div>
                                )}

                                {/* Business Type */}
                                {profile.business_type && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Jenis Bisnis
                                        </div>
                                        <p className="font-medium capitalize">{profile.business_type}</p>
                                    </div>
                                )}

                                {/* Tax Number */}
                                {profile.tax_number && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Hash className="h-4 w-4" />
                                            <span>NPWP / Tax Number</span>
                                        </div>
                                        <p className="font-medium font-mono">{profile.tax_number}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kontak</CardTitle>
                                <CardDescription>
                                    Informasi kontak bisnis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Email</div>
                                            <a
                                                href={`mailto:${profile.email}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {profile.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {profile.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Telepon</div>
                                            <a
                                                href={`tel:${profile.phone}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {profile.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {profile.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Website</div>
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {profile.website}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {profile.full_address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Alamat</div>
                                            <p className="font-medium whitespace-pre-line">
                                                {profile.full_address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description */}
                        {profile.description && (
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Deskripsi Bisnis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {profile.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Belum Ada Profil Bisnis
                            </h3>
                            <p className="text-muted-foreground max-w-md mb-6">
                                Buat profil bisnis Anda untuk menampilkan informasi bisnis pada invoice
                                dan dokumen lainnya.
                            </p>
                            <Button asChild size="lg">
                                <Link href={route('business-profile.create')}>
                                    <Building2 className="mr-2 h-5 w-5" />
                                    Buat Profil Bisnis
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
