import {
    BarChart3,
    BookOpen,
    ClipboardCheck,
    Download,
    Users,
} from 'lucide-react';

import type { LessonDifficulty, QuestionFormData, TeacherPanel } from './types';

export const emptyQuestionForm: QuestionFormData = {
    lesson_id: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
};

export const panels: TeacherPanel[] = [
    {
        id: 'students',
        title: 'Students',
        description: 'Manage students',
        icon: Users,
    },
    {
        id: 'lessons',
        title: 'Lessons',
        description: 'Manage lessons',
        icon: BookOpen,
    },
    {
        id: 'scores',
        title: 'Scores',
        description: 'View scores',
        icon: BarChart3,
    },
    {
        id: 'activity_answers',
        title: 'Submissions',
        description: 'Review submissions',
        icon: ClipboardCheck,
    },
    {
        id: 'export',
        title: 'Export',
        description: 'Export data',
        icon: Download,
    },
];

export const difficultyClassNames: Record<LessonDifficulty, string> = {
    beginner:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    intermediate:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    advanced:
        'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
};

export const statusClassNames = {
    published:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    draft: 'border-muted bg-muted/40 text-muted-foreground',
};
