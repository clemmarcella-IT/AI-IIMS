import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type LessonSlide = {
    title: string;
    body: string;
};

const emptySlide = (): LessonSlide => ({ title: '', body: '' });

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const stripHtml = (value: string) =>
    value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export const serializeSlideDeck = (slides: LessonSlide[]) => {
    const content = slides
        .map(
            (slide, index) => `
<section data-lesson-slide="true" data-slide-index="${index + 1}">
<h3>${escapeHtml(slide.title)}</h3>
<p>${escapeHtml(slide.body).replace(/\n/g, '<br>')}</p>
</section>`,
        )
        .join('');

    return `<div data-lesson-slides="true">${content}</div>`;
};

export const parseSlideDeck = (html: string): LessonSlide[] => {
    if (!html.includes('data-lesson-slides')) {
        return [];
    }

    if (typeof DOMParser === 'undefined') {
        return [];
    }

    const documentValue = new DOMParser().parseFromString(html, 'text/html');

    return Array.from(
        documentValue.querySelectorAll('[data-lesson-slide]'),
    ).map((slide) => ({
        title: slide.querySelector('h1,h2,h3,h4')?.textContent?.trim() ?? '',
        body: Array.from(slide.querySelectorAll('p,li'))
            .map((node) => node.textContent?.trim() ?? '')
            .filter(Boolean)
            .join('\n'),
    }));
};

export const hasSlideDeck = (html: string) =>
    html.includes('data-lesson-slides');

export const slideDeckHasContent = (html: string) =>
    parseSlideDeck(html).some(
        (slide) => slide.title.trim() !== '' || slide.body.trim() !== '',
    ) || stripHtml(html) !== '';

export function ensureSlideDeck(html: string) {
    return hasSlideDeck(html) ? html : serializeSlideDeck([emptySlide()]);
}

export function SlideDeckEditor({
    id,
    value,
    onChange,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
}) {
    const slides = useMemo(() => {
        const parsedSlides = parseSlideDeck(value);

        return parsedSlides.length > 0 ? parsedSlides : [emptySlide()];
    }, [value]);

    const updateSlides = (nextSlides: LessonSlide[]) => {
        onChange(
            serializeSlideDeck(
                nextSlides.length > 0 ? nextSlides : [emptySlide()],
            ),
        );
    };

    return (
        <div className="grid gap-4">
            {slides.map((slide, index) => (
                <div
                    key={`${id}-slide-${index}`}
                    className="grid gap-3 rounded-lg border bg-muted/20 p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">Slide {index + 1}</p>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={slides.length === 1}
                            onClick={() =>
                                updateSlides(
                                    slides.filter(
                                        (_, slideIndex) => slideIndex !== index,
                                    ),
                                )
                            }
                            aria-label={`Remove slide ${index + 1}`}
                        >
                            <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`${id}-slide-${index}-title`}>
                            Title
                        </Label>
                        <Input
                            id={`${id}-slide-${index}-title`}
                            value={slide.title}
                            onChange={(event) =>
                                updateSlides(
                                    slides.map((item, slideIndex) =>
                                        slideIndex === index
                                            ? {
                                                  ...item,
                                                  title: event.target.value,
                                              }
                                            : item,
                                    ),
                                )
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`${id}-slide-${index}-body`}>
                            Body
                        </Label>
                        <Textarea
                            id={`${id}-slide-${index}-body`}
                            value={slide.body}
                            onChange={(event) =>
                                updateSlides(
                                    slides.map((item, slideIndex) =>
                                        slideIndex === index
                                            ? {
                                                  ...item,
                                                  body: event.target.value,
                                              }
                                            : item,
                                    ),
                                )
                            }
                            className="min-h-28"
                        />
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => updateSlides([...slides, emptySlide()])}
            >
                <Plus className="size-4" aria-hidden="true" />
                Add Slide
            </Button>
        </div>
    );
}

export function SlideDeckViewer({
    html,
    className,
}: {
    html: string;
    className?: string;
}) {
    const slides = useMemo(() => parseSlideDeck(html), [html]);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeSlide = slides[Math.min(activeIndex, slides.length - 1)];

    if (slides.length === 0) {
        return (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No slides added yet.
            </p>
        );
    }

    return (
        <div className={cn('grid gap-3', className)}>
            <div className="flex aspect-video min-h-64 flex-col justify-center rounded-lg border bg-card p-6 shadow-sm sm:p-10">
                <p className="text-sm font-medium text-muted-foreground">
                    Slide {Math.min(activeIndex, slides.length - 1) + 1} of{' '}
                    {slides.length}
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
                    {activeSlide?.title || 'Untitled slide'}
                </h3>
                <p className="mt-5 text-base leading-7 whitespace-pre-wrap text-muted-foreground sm:text-lg">
                    {activeSlide?.body || 'No slide body added yet.'}
                </p>
            </div>
            <div className="flex items-center justify-between gap-3">
                <Button
                    type="button"
                    variant="outline"
                    disabled={activeIndex === 0}
                    onClick={() =>
                        setActiveIndex((current) => Math.max(0, current - 1))
                    }
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Previous
                </Button>
                <div className="flex gap-1">
                    {slides.map((_, index) => (
                        <button
                            key={`slide-dot-${index}`}
                            type="button"
                            className={cn(
                                'size-2 rounded-full bg-muted-foreground/30',
                                index === activeIndex && 'bg-primary',
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    disabled={activeIndex >= slides.length - 1}
                    onClick={() =>
                        setActiveIndex((current) =>
                            Math.min(slides.length - 1, current + 1),
                        )
                    }
                >
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
