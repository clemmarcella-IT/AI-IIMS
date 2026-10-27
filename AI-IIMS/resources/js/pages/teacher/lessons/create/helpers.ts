import type {
    ActivityType,
    ClickableCard,
    LessonActivity,
    LessonMedia,
    LessonMediaSubmitItem,
    LessonSection,
    LessonSubmitPayload,
    MatchingPair,
} from './types';

export const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
} as const;

export const difficultyClassNames = {
    beginner:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    intermediate:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    advanced:
        'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
} as const;

export const suggestionLabels = {
    expanded_explanation: 'Expanded Explanation',
    lesson_section: 'Lesson Section',
    section_activity: 'Section Activity',
    mini_quiz: 'Mini Quiz',
    true_false: 'True or False',
    fill_blank: 'Fill in the Blank',
    matching: 'Drag-and-Drop Matching',
    sequencing: 'Sequencing',
    reflection: 'Reflection',
    clickable_activity: 'Clickable Cards',
    media_suggestion: 'Media',
    summary: 'Summary',
} as const;

export const activityLabels: Record<ActivityType, string> = {
    mini_quiz: 'Mini Quiz',
    true_false: 'True or False',
    fill_blank: 'Fill in the Blank',
    matching: 'Drag-and-Drop Matching',
    sequencing: 'Sequencing',
    reflection: 'Reflection Question',
    clickable_activity: 'Clickable Cards',
};

export const defaultChoices = ['', '', '', ''];
export const maxMediaUploadBytes = 10 * 1024 * 1024;
export const maxMediaUploadLabel = '10 MB';

export const createId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const nextSortOrder = (sections: LessonSection[]) =>
    sections.length === 0
        ? 1
        : Math.max(...sections.map((s) => s.sort_order)) + 1;

export const normalizeChoices = (choices?: string[]) =>
    Array.from({ length: 4 }, (_, i) => choices?.[i] ?? '');

export const normalizePairs = (pairs?: MatchingPair[]) =>
    pairs && pairs.length > 0
        ? pairs
        : [
              { left: '', right: '' },
              { left: '', right: '' },
          ];

export const normalizeItems = (items?: string[]) =>
    items && items.length > 0 ? items : ['', ''];

export const normalizeCards = (cards?: ClickableCard[]) =>
    cards && cards.length > 0
        ? cards
        : [
              { label: '', description: '', is_correct: true },
              { label: '', description: '', is_correct: false },
          ];

export const inferMediaTypeFromFile = (file: File): LessonMedia['type'] => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (file.type.startsWith('image/')) {
        return 'image';
    }

    if (file.type.startsWith('video/')) {
        return 'video';
    }

    if (['pdf', 'ppt', 'pptx'].includes(extension ?? '')) {
        return 'slides';
    }

    return 'link';
};

export const normalizeMedia = (mediaItem: LessonMedia): LessonMedia => ({
    ...mediaItem,
    source: mediaItem.source ?? 'url',
    file: mediaItem.file ?? null,
    cue_points: (mediaItem.cue_points ?? []).map((cuePoint) => ({
        ...cuePoint,
        id: String(cuePoint.id),
    })),
});

export const normalizeAnswerKey = (
    answer: LessonActivity['correct_answer'] | undefined,
    choices: string[],
) => {
    if (typeof answer === 'string' && ['A', 'B', 'C', 'D'].includes(answer)) {
        return answer;
    }

    if (typeof answer !== 'string') {
        return 'A';
    }

    const answerIndex = choices.findIndex(
        (choice) => choice.trim().toLowerCase() === answer.trim().toLowerCase(),
    );

    return answerIndex >= 0 ? String.fromCharCode(65 + answerIndex) : 'A';
};

export const getCsrfToken = () => {
    if (typeof document === 'undefined') {
        return '';
    }

    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.content ?? ''
    );
};

export const serializeMediaForSubmit = (
    mediaItem: LessonMedia,
    index: number,
): LessonMediaSubmitItem => {
    const payload: LessonMediaSubmitItem = {
        type: mediaItem.type,
        url: mediaItem.url,
        caption: mediaItem.caption,
        sort_order: index + 1,
        cue_points: (mediaItem.cue_points ?? []).map((cuePoint) => ({
            timestamp_seconds: cuePoint.timestamp_seconds,
            type: cuePoint.type,
            question: cuePoint.question,
            options: cuePoint.options,
            correct_option: cuePoint.correct_option,
            explanation: cuePoint.explanation,
            content: cuePoint.content,
        })),
    };

    if (/^\d+$/.test(mediaItem.id)) {
        payload.id = mediaItem.id;
    }

    if (mediaItem.file) {
        payload.file = mediaItem.file;
    }

    return payload;
};

const mediaItemForSignature = ({
    file,
    ...mediaItem
}: LessonMediaSubmitItem) => ({
    ...mediaItem,
    file: file
        ? {
              lastModified: file.lastModified,
              name: file.name,
              size: file.size,
              type: file.type,
          }
        : null,
});

export const lessonPayloadSignature = (payload: LessonSubmitPayload) =>
    JSON.stringify({
        ...payload,
        sections: payload.sections.map((section) => ({
            ...section,
            media: section.media.map(mediaItemForSignature),
        })),
        media: payload.media.map(mediaItemForSignature),
    });

export const findOversizedMediaFile = (
    payload: LessonSubmitPayload,
): File | null => {
    const mediaItems = [
        ...payload.media,
        ...payload.sections.flatMap((section) => section.media),
    ];

    return (
        mediaItems.find(
            (mediaItem) =>
                mediaItem.file instanceof File &&
                mediaItem.file.size > maxMediaUploadBytes,
        )?.file ?? null
    );
};

export const serializeActivityForSubmit = (
    {
        type,
        title,
        instruction,
        question,
        statement,
        sentence,
        blank_label,
        prompt,
        choices,
        pairs,
        items,
        cards,
        correct_answer,
        explanation,
        record_score,
    }: LessonActivity,
    index: number,
) => ({
    type,
    title,
    instruction,
    question,
    statement,
    sentence,
    blank_label,
    prompt,
    choices,
    pairs,
    items,
    cards,
    correct_answer,
    explanation,
    record_score,
    sort_order: index + 1,
});

export const buildActivity = (
    type: ActivityType,
    activity?: Partial<LessonActivity>,
): LessonActivity => {
    const base = {
        id: createId('activity'),
        type,
        title: activity?.title ?? '',
        instruction: activity?.instruction ?? '',
        explanation: activity?.explanation ?? '',
        record_score: activity?.record_score ?? type !== 'reflection',
    };

    if (type === 'mini_quiz') {
        const choices = normalizeChoices(activity?.choices);

        return {
            ...base,
            question: activity?.question ?? '',
            choices,
            correct_answer: normalizeAnswerKey(
                activity?.correct_answer,
                choices,
            ),
        };
    }

    if (type === 'true_false') {
        return {
            ...base,
            statement: activity?.statement ?? '',
            correct_answer:
                typeof activity?.correct_answer === 'boolean'
                    ? activity.correct_answer
                    : true,
        };
    }

    if (type === 'fill_blank') {
        return {
            ...base,
            sentence: activity?.sentence ?? '',
            blank_label: activity?.blank_label ?? 'missing word',
            correct_answer:
                typeof activity?.correct_answer === 'string'
                    ? activity.correct_answer
                    : '',
        };
    }

    if (type === 'matching') {
        const pairs = normalizePairs(activity?.pairs);

        return { ...base, pairs, correct_answer: pairs };
    }

    if (type === 'sequencing') {
        const items = normalizeItems(activity?.items);

        return { ...base, items, correct_answer: items };
    }

    if (type === 'clickable_activity') {
        const cards = normalizeCards(activity?.cards);

        return {
            ...base,
            question: activity?.question ?? '',
            cards,
            correct_answer: cards
                .filter((c) => c.is_correct)
                .map((c) => c.label),
        };
    }

    return {
        ...base,
        prompt: activity?.prompt ?? activity?.instruction ?? '',
        correct_answer: null,
    };
};

export function getVideoEmbedUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    try {
        const videoUrl = new URL(url);

        if (videoUrl.hostname.includes('youtube.com')) {
            const videoId = videoUrl.searchParams.get('v');

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        if (videoUrl.hostname.includes('youtu.be')) {
            const videoId = videoUrl.pathname.replace('/', '');

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        return null;
    } catch {
        return null;
    }
}
