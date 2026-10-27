import type Quill from 'quill';
import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    className?: string;
    id?: string;
    minHeight?: CSSProperties['minHeight'];
    onChange: (value: string) => void;
    style?: CSSProperties;
    value: string;
};

export function RichTextEditor({
    className,
    id,
    minHeight = '12rem',
    onChange,
    style,
    value,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const onChangeRef = useRef(onChange);
    const quillRef = useRef<Quill | null>(null);
    const valueRef = useRef(value);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let cleanup: (() => void) | undefined;
        let mounted = true;

        void import('quill').then(({ default: QuillEditor }) => {
            if (!mounted || !editorRef.current || quillRef.current) {
                return;
            }

            const quill = new QuillEditor(editorRef.current, {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['blockquote', 'link'],
                        ['clean'],
                    ],
                },
                theme: 'snow',
            });

            quill.clipboard.dangerouslyPasteHTML(valueRef.current, 'silent');

            const handleTextChange = () => {
                const nextValue = quill.root.innerHTML;

                valueRef.current = nextValue;
                onChangeRef.current(nextValue);
            };

            quill.on('text-change', handleTextChange);
            quillRef.current = quill;
            cleanup = () => quill.off('text-change', handleTextChange);
        });

        return () => {
            mounted = false;
            cleanup?.();
            quillRef.current = null;
        };
    }, []);

    useEffect(() => {
        const quill = quillRef.current;

        if (!quill || value === valueRef.current) {
            valueRef.current = value;

            return;
        }

        const selection = quill.getSelection();

        quill.clipboard.dangerouslyPasteHTML(value, 'silent');
        valueRef.current = value;

        if (selection) {
            quill.setSelection(selection, 'silent');
        }
    }, [value]);

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border border-input bg-background text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30 [&_.ql-container.ql-snow]:border-0 [&_.ql-editor]:min-h-(--lesson-editor-min-height) [&_.ql-toolbar.ql-snow]:border-x-0 [&_.ql-toolbar.ql-snow]:border-t-0',
                className,
            )}
            style={
                {
                    '--lesson-editor-min-height': minHeight,
                    ...style,
                } as CSSProperties
            }
        >
            <div id={id} ref={editorRef} />
        </div>
    );
}
