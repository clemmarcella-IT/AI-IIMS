import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type RichTextContentProps = {
    html: string;
    className?: string;
};

// Renders teacher-authored rich text (HTML produced by the PrimeReact/Quill
// Editor). The HTML is sanitized with DOMPurify before injection to strip any
// scripts or event handlers, and wrapped in Quill's `ql-snow`/`ql-editor`
// classes so alignment, indent, and list styles render exactly as authored.
export default function RichTextContent({
    html,
    className,
}: RichTextContentProps) {
    const sanitized = useMemo(() => DOMPurify.sanitize(html ?? ''), [html]);

    return (
        <div className={cn('ql-snow lesson-prose', className)}>
            <div
                className="ql-editor p-0"
                dangerouslySetInnerHTML={{ __html: sanitized }}
            />
        </div>
    );
}
