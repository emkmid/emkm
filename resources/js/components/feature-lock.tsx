import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Lock, Sparkles } from 'lucide-react';

interface FeatureLockProps {
    featureName: string;
    description?: string;
    requiredPlan?: string;
    className?: string;
}

export function FeatureLock({ 
    featureName, 
    description = "Fitur ini tidak tersedia di paket Anda saat ini.",
    requiredPlan = "Basic",
    className = ""
}: FeatureLockProps) {
    return (
        <div className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}>
            <div className="max-w-md w-full">
                <Alert className="border-2 border-[#23BBB7]/20 bg-gradient-to-br from-[#23BBB7]/5 to-transparent">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-[#23BBB7]/10 p-3">
                            <Lock className="h-6 w-6 text-[#23BBB7]" />
                        </div>
                        <div className="flex-1">
                            <AlertTitle className="text-lg font-semibold mb-2">
                                {featureName} - Fitur Premium
                            </AlertTitle>
                            <AlertDescription className="text-sm text-muted-foreground mb-4">
                                {description}
                            </AlertDescription>
                            <div className="bg-white/50 rounded-lg p-3 mb-4 border border-[#23BBB7]/20">
                                <div className="flex items-center gap-2 text-sm">
                                    <Sparkles className="h-4 w-4 text-[#23BBB7]" />
                                    <span className="font-medium">
                                        Tersedia di paket <span className="text-[#23BBB7] font-bold">{requiredPlan}</span> ke atas
                                    </span>
                                </div>
                            </div>
                            <Link href="/dashboard/packages">
                                <Button className="w-full bg-[#23BBB7] hover:bg-[#1a8f85]">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Upgrade Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    );
}
