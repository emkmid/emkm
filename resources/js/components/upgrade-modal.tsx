import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Package {
    id: number;
    name: string;
    price: number;
    features: string[];
    is_popular: boolean;
}

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
    featureName: string;
    currentPackage?: string;
    message?: string;
    packages?: Package[];
}

export default function UpgradeModal({ 
    open, 
    onClose, 
    featureName, 
    currentPackage = 'Free',
    message,
    packages 
}: UpgradeModalProps) {
    const defaultPackages: Package[] = [
        {
            id: 2,
            name: 'Basic',
            price: 29000,
            features: [
                '200 transactions/month',
                '50 invoices/month',
                '100 customers',
                'Financial reports',
                'Business profile',
                'PDF export',
            ],
            is_popular: true,
        },
        {
            id: 3,
            name: 'Pro',
            price: 59000,
            features: [
                'Unlimited transactions',
                'Unlimited invoices',
                'Unlimited customers',
                'All Basic features',
                'Email invoices',
                'API access',
                'Priority support',
            ],
            is_popular: false,
        },
    ];

    const displayPackages = packages || defaultPackages;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="h-6 w-6 text-yellow-500" />
                        Upgrade Required
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {message || `The feature "${featureName}" is not available in your current ${currentPackage} plan.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-6">
                    {displayPackages.map((pkg) => (
                        <div 
                            key={pkg.id}
                            className={`relative rounded-lg border-2 p-6 ${
                                pkg.is_popular 
                                    ? 'border-primary shadow-lg' 
                                    : 'border-border'
                            }`}
                        >
                            {pkg.is_popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    Most Popular
                                </Badge>
                            )}

                            <div className="mb-4">
                                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                                <div className="mt-2">
                                    <span className="text-3xl font-bold">
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-muted-foreground">/bulan</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/dashboard/packages">
                                <Button 
                                    className="w-full"
                                    variant={pkg.is_popular ? 'default' : 'outline'}
                                >
                                    Choose {pkg.name}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
