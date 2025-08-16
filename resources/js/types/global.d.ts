import type { route as routeFn } from 'ziggy-js';

export {};

declare global {
    const route: typeof routeFn;
}

declare namespace JSX {
    interface IntrinsicElements {
        'trix-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            input?: string;
            placeholder?: string;
        };
    }
}
