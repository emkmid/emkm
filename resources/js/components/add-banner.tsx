import { useEffect, useRef } from 'react';

export default function AdBanner() {
    const adRef = useRef<HTMLModElement | null>(null);

    useEffect(() => {
        try {
            if ((window as any).adsbygoogle && adRef.current) {
                (window as any).adsbygoogle.push({});
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="my-4">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6031172361214159"
                data-ad-slot="1234567890"
                data-ad-format="auto"
                data-full-width-responsive="true"
                ref={adRef}
            ></ins>
        </div>
    );
}
