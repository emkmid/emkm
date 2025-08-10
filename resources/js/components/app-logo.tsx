import { Link } from '@inertiajs/react';

export default function AppLogo() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <img src="/images/emkm.png" className="h-12 w-auto" alt="E-MKM" />
            {/* <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
                EMKM
            </span> */}
        </Link>
    );
}