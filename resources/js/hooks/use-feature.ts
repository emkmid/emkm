import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function useFeature(featureKey: string): boolean {
    const { auth } = usePage<SharedData>().props;
    return auth.features?.[featureKey] ?? false;
}

export function useFeatures(): Record<string, boolean> {
    const { auth } = usePage<SharedData>().props;
    return auth.features ?? {};
}
