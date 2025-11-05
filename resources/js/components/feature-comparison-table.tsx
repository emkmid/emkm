import { Check, X, Infinity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface FeatureComparison {
    [category: string]: Array<{
        feature: PackageFeature;
        limits: {
            [packageId: number]: FeatureLimit;
        };
    }>;
}

interface Package {
    id: number;
    name: string;
    price: number;
}

interface Props {
    packages: Package[];
    featureComparison: FeatureComparison;
}

export default function FeatureComparisonTable({ packages, featureComparison }: Props) {
    const categoryColors: { [key: string]: string } = {
        accounting: 'bg-blue-100 text-blue-800',
        articles: 'bg-purple-100 text-purple-800',
        invoices: 'bg-green-100 text-green-800',
        customers: 'bg-orange-100 text-orange-800',
        others: 'bg-gray-100 text-gray-800',
    };

    const renderFeatureValue = (feature: PackageFeature, limit: FeatureLimit) => {
        if (!limit.is_enabled) {
            return (
                <div className="flex items-center justify-center">
                    <X className="h-5 w-5 text-red-500" />
                </div>
            );
        }

        if (feature.limit_type === 'boolean') {
            return (
                <div className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                </div>
            );
        }

        if (feature.limit_type === 'numeric') {
            if (limit.numeric_limit === null || limit.numeric_limit === -1) {
                return (
                    <div className="flex flex-col items-center">
                        <Infinity className="h-5 w-5 text-green-600" />
                        <span className="text-xs text-gray-500 mt-1">Unlimited</span>
                    </div>
                );
            }
            return (
                <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-900">
                        {limit.numeric_limit}
                    </span>
                    <span className="text-xs text-gray-500">per bulan</span>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
            </div>
        );
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">Perbandingan Fitur</CardTitle>
                <CardDescription>
                    Lihat detail fitur yang tersedia di setiap paket berlangganan
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {Object.entries(featureComparison).map(([category, features]) => (
                    <div key={category} className="border-b last:border-b-0">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <Badge className={categoryColors[category] || categoryColors.others}>
                                {category.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white">
                                    <TableRow>
                                        <TableHead className="w-[40%] font-semibold">Fitur</TableHead>
                                        {packages.map((pkg) => (
                                            <TableHead key={pkg.id} className="text-center">
                                                <div className="font-bold">{pkg.name}</div>
                                                <div className="text-xs font-normal text-gray-500">
                                                    {pkg.price === 0
                                                        ? 'Gratis'
                                                        : `Rp ${pkg.price.toLocaleString('id-ID')}/bln`}
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {features.map(({ feature, limits }) => (
                                        <TableRow key={feature.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {feature.feature_name}
                                                    </div>
                                                    {feature.description && (
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {feature.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            {packages.map((pkg) => (
                                                <TableCell key={pkg.id} className="text-center">
                                                    {renderFeatureValue(feature, limits[pkg.id])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
