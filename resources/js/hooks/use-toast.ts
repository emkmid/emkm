import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function useToast() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            // You can integrate with your toast library here
            console.log('Success:', flash.success);
        }
        if (flash?.error) {
            console.error('Error:', flash.error);
        }
    }, [flash]);

    return {
        success: (message: string) => {
            console.log('Success:', message);
        },
        error: (message: string) => {
            console.error('Error:', message);
        },
    };
}
