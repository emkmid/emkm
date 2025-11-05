import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface QuotaWidgetProps {
    transactions?: {
        current: number;
        limit: number;
        isUnlimited: boolean;
    };
    invoices?: {
        current: number;
        limit: number;
        isUnlimited: boolean;
    };
    customers?: {
        current: number;
        limit: number;
        isUnlimited: boolean;
    };
    articles?: {
        current: number;
        limit: number;
        isUnlimited: boolean;
    };
}

export default function QuotaWidget({ transactions, invoices, customers, articles }: QuotaWidgetProps) {
    const items = [
        { name: 'Transactions', data: transactions, icon: '💰' },
        { name: 'Invoices', data: invoices, icon: '📄' },
        { name: 'Customers', data: customers, icon: '👥' },
        { name: 'Articles', data: articles, icon: '📝' },
    ].filter(item => item.data);

    if (items.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage This Month
                </CardTitle>
                <CardDescription>Monitor your subscription limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => {
                    const { current, limit, isUnlimited } = item.data!;
                    const percentage = isUnlimited ? 0 : (current / limit) * 100;
                    const isNearLimit = percentage >= 80;
                    const isAtLimit = current >= limit && !isUnlimited;

                    return (
                        <div key={item.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium text-sm">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isUnlimited ? (
                                        <Badge variant="secondary" className="text-xs">
                                            Unlimited
                                        </Badge>
                                    ) : (
                                        <>
                                            <span className="text-sm text-muted-foreground">
                                                {current} / {limit}
                                            </span>
                                            {isAtLimit && (
                                                <AlertCircle className="h-4 w-4 text-destructive" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isUnlimited && (
                                <Progress 
                                    value={percentage} 
                                    className={`h-2 ${isAtLimit ? 'bg-destructive/20' : isNearLimit ? 'bg-yellow-500/20' : ''}`}
                                />
                            )}
                            {isAtLimit && (
                                <p className="text-xs text-destructive">
                                    Limit reached. <Link href="/dashboard/packages" className="underline font-medium">Upgrade now</Link>
                                </p>
                            )}
                        </div>
                    );
                })}

                <Link 
                    href="/dashboard/packages"
                    className="block w-full mt-4 py-2 text-center text-sm font-medium text-primary hover:underline"
                >
                    View All Packages →
                </Link>
            </CardContent>
        </Card>
    );
}
