import type { Lesson, LessonDifficulty, LessonQuestion, Score } from './types';

export const formatDifficulty = (difficulty: LessonDifficulty) =>
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

export const formatScoreType = (type: Score['score_type']) => {
    if (type === 'lesson') {
        return 'Lesson';
    }

    return type === 'pretest' ? 'Pretest' : 'Posttest';
};

export const formatActivityType = (type: string) =>
    type
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

export const formatPercent = (value: number | null) =>
    value === null ? 'N/A' : `${Math.round(value)}%`;

export const formatScoreValue = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(2);

export const formatDate = (date: string | null) => {
    if (!date) {
        return 'N/A';
    }

    const dateValue = date.includes('T')
        ? new Date(date)
        : new Date(`${date}T00:00:00`);

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(dateValue);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const formatAnswerPart = (value: unknown): string => {
    if (value === null || value === undefined) {
        return 'N/A';
    }

    if (typeof value === 'boolean') {
        return value ? 'True' : 'False';
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return value.toString();
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return 'N/A';
        }

        return value.map(formatAnswerPart).join('\n');
    }

    if (isRecord(value)) {
        const left = value.left;
        const right = value.right;

        if (left !== undefined || right !== undefined) {
            return `${formatAnswerPart(left)} -> ${formatAnswerPart(right)}`;
        }

        return Object.entries(value)
            .map(
                ([key, entryValue]) =>
                    `${key}: ${formatAnswerPart(entryValue)}`,
            )
            .join('\n');
    }

    return String(value);
};

export const formatAnswerValue = (value: unknown) => formatAnswerPart(value);

export const lessonUrl = (lesson: Lesson) => `/teacher/lessons/${lesson.id}`;

export const questionUrl = (question: LessonQuestion) =>
    `/teacher/questions/${question.id}`;
