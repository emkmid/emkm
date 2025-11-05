import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Check, Lock, Sparkles, Zap } from 'lucide-react';

interface QuotaDisplayProps {
    current: number;
    limit: number;
    remaining: number;
    isUnlimited: boolean;
    featureName: string;
}

/**
 * Display quota/limit for a feature
 */
export function QuotaDisplay({ current, limit, remaining, isUnlimited, featureName }: QuotaDisplayProps) {
    if (isUnlimited) {
        return (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Check className="mr-1 h-3 w-3" />
                Unlimited {featureName}
            </Badge>
        );
    }

    const percentage = (current / limit) * 100;
    const isWarning = percentage >= 80;
    const isDanger = percentage >= 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{featureName} Usage</span>
                <span className={`font-medium ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : ''}`}>
                    {current} / {limit}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all ${
                        isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {remaining === 0 && (
                <p className="text-xs text-red-600">Limit tercapai! Upgrade untuk membuat lebih banyak.</p>
            )}
        </div>
    );
}

interface UpgradePromptProps {
    feature: string;
    requiredPackage: 'Basic' | 'Pro';
    price: number;
    benefits?: string[];
    className?: string;
}

/**
 * Upgrade prompt card when feature is locked
 */
export function UpgradePrompt({ feature, requiredPackage, price, benefits, className }: UpgradePromptProps) {
    const defaultBenefits = requiredPackage === 'Basic' 
        ? [
            'Buat invoice untuk customer',
            'Laporan keuangan lengkap',
            'Profil bisnis dengan logo',
            'Backup data otomatis',
        ]
        : [
            'Unlimited transaksi & invoice',
            'Kirim invoice via email',
            'Audit log lengkap',
            'Priority support',
            'API access',
        ];

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className={`border-2 border-primary ${className}`}>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-full bg-primary/10 p-2">
                        <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {requiredPackage} Required
                    </Badge>
                </div>
                <CardTitle className="text-2xl">Upgrade untuk {feature}</CardTitle>
                <CardDescription>
                    Fitur ini tersedia di paket {requiredPackage}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Yang akan Anda dapatkan:</p>
                    <ul className="space-y-2">
                        {(benefits || defaultBenefits).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold">{formatPrice(price)}</span>
                        <span className="text-muted-foreground">/bulan</span>
                    </div>

                    <Button asChild size="lg" className="w-full">
                        <Link href={route('packages.index')}>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Upgrade ke {requiredPackage}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface LimitReachedAlertProps {
    featureName: string;
    currentLimit: number;
    nextPackage: 'Basic' | 'Pro';
    nextLimit: number | 'Unlimited';
}

/**
 * Alert when user has reached their limit
 */
export function LimitReachedAlert({ featureName, currentLimit, nextPackage, nextLimit }: LimitReachedAlertProps) {
    return (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limit Tercapai</AlertTitle>
            <AlertDescription className="space-y-3">
                <p>
                    Anda telah mencapai batas <strong>{currentLimit} {featureName}</strong> untuk paket Anda.
                </p>
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <p className="text-sm">
                        Upgrade ke <strong>{nextPackage}</strong> untuk {nextLimit === 'Unlimited' ? 'unlimited' : nextLimit} {featureName}
                    </p>
                </div>
                <Button asChild size="sm" className="mt-2">
                    <Link href={route('packages.index')}>
                        Lihat Paket
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
}

interface FeatureLockedButtonProps {
    featureName: string;
    requiredPackage: 'Basic' | 'Pro';
    children: React.ReactNode;
    className?: string;
}

/**
 * Button that shows upgrade prompt when clicked if feature is locked
 */
export function FeatureLockedButton({ featureName, requiredPackage, children, className }: FeatureLockedButtonProps) {
    return (
        <Button
            variant="outline"
            className={`relative ${className}`}
            disabled
            title={`Upgrade ke ${requiredPackage} untuk ${featureName}`}
        >
            <Lock className="mr-2 h-4 w-4" />
            {children}
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary text-xs">
                {requiredPackage}
            </Badge>
        </Button>
    );
}
