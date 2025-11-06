import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: string;
    containerClassName?: string;
}

export default function LazyImage({
    src,
    alt,
    fallback = '/images/placeholder.png',
    className,
    containerClassName,
    ...props
}: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={cn('relative overflow-hidden', containerClassName)}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
                src={error ? fallback : src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                }}
                className={cn(
                    'transition-opacity duration-300',
                    isLoading ? 'opacity-0' : 'opacity-100',
                    className
                )}
                {...props}
            />
        </div>
    );
}
