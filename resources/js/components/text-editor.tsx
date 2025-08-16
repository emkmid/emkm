// resources/js/Components/TrixEditor.tsx
import React, { useEffect, useRef } from 'react';

type Props = {
    id: string;
    value?: string;
    onChange: (html: string) => void;
    uploadUrl: string; // route('articles.upload')
    placeholder?: string;
    className?: string;
};

const TrixEditor: React.FC<Props> = ({ id, value = '', onChange, uploadUrl, placeholder, className }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const input = inputRef.current!;
        const editor = (input as any).editor;

        const handleChange = (e: Event) => {
            const element = e.target as HTMLInputElement;
            onChange(element.value);
        };

        const handleAttachmentAdd = async (e: any) => {
            const attachment = e.attachment;
            const file = attachment.file;
            if (!file) return;

            const form = new FormData();
            form.append('image', file);

            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                },
                body: form,
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                attachment.setAttributes({ url: data.url, href: data.href });
            } else {
                attachment.remove();
                alert('Upload gagal.');
            }
        };

        document.addEventListener('trix-change', handleChange);
        document.addEventListener('trix-attachment-add', handleAttachmentAdd as EventListener);

        return () => {
            document.removeEventListener('trix-change', handleChange);
            document.removeEventListener('trix-attachment-add', handleAttachmentAdd as EventListener);
        };
    }, [uploadUrl, onChange]);

    return (
        <div className={className}>
            <input id={id} type="hidden" value={value} ref={inputRef} />
            {React.createElement('trix-editor', {
                input: id,
                placeholder: placeholder || 'Tulis artikel...',
                className: 'trix-content min-h-40',
            })}
        </div>
    );
};

export default TrixEditor;
