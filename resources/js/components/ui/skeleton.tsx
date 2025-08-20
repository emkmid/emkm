import { cn } from "@/lib/utils"
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-primary/10 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export const ArticleCardSkeleton: React.FC = () => {
    return (
        <Card className="overflow-hidden bg-white shadow-sm">
            <div className="h-48 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
            <CardHeader className="p-6">
                <div className="mb-3 flex items-center gap-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="mb-3 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="mb-4 space-y-1">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex justify-between">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                </div>
            </CardHeader>
        </Card>
    );
};

export const SearchBarSkeleton: React.FC = () => {
    return (
        <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                <div className="relative flex-1 max-w-md">
                    <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
                </div>
                <div className="flex gap-2">
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
    );
};

export const StatBarSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-3">
                    <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gray-200" />
                    <div className="mx-auto h-6 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
                </div>
            ))}
        </div>
    );
};

export { Skeleton }
