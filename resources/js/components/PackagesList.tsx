import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import SubscribeButton from './SubscribeButton';

type Package = {
    id: number;
    name: string;
    description?: string;
    price: number;
};

export default function PackagesList() {
    const [packages, setPackages] = useState<Package[]>([]);

    useEffect(() => {
        fetch('/packages')
            .then((r) => r.json())
            .then(setPackages)
            .catch(console.error);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
                <Card key={pkg.id}>
                    <CardHeader>
                        <CardTitle>{pkg.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 text-sm text-muted-foreground">{pkg.description}</div>
                        <div className="mb-4 text-lg font-semibold">${pkg.price}</div>
                        <div className="flex gap-2">
                            <SubscribeButton packageId={pkg.id} />
                            <Button variant="ghost">Details</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
