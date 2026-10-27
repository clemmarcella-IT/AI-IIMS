import type { LucideIcon } from 'lucide-react';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type Panel =
    | 'students'
    | 'lessons'
    | 'questions'
    | 'scores'
    | 'activity_answers'
    | 'export';
export type AnswerKey = 'A' | 'B' | 'C' | 'D';

export type Lesson = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
    content: string | null;
    difficulty_level: LessonDifficulty;
    is_published: boolean;
    questions_count: number;
    completed_count: number;
    average_progress: number | null;
    average_score: number | null;
    updated_at: string | null;
};

export type Student = {
    id: number;
    student_code: string;
    name: string;
    grade_level: string;
    section: string;
    completed_lessons: number;
    average_progress: number | null;
    average_lesson_score: number | null;
    pretest_percentage: number | null;
    posttest_percentage: number | null;
    updated_at: string | null;
};

export type LessonQuestion = {
    id: number;
    lesson_id: number;
    lesson_title: string | null;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: AnswerKey;
    explanation: string | null;
    updated_at: string | null;
};

export type Score = {
    id: string;
    student_code: string | null;
    student_name: string;
    score_type: 'lesson' | 'pretest' | 'posttest';
    lesson_title: string | null;
    score: number;
    total_items: number;
    percentage: number | null;
    submitted_at: string | null;
};

export type ActivityAnswerSummary = {
    id: string;
    student_id: number;
    lesson_id: number;
    student_code: string | null;
    student_name: string;
    lesson_subject: string | null;
    lesson_title: string;
    answered_count: number;
    total_activities: number;
    correct_count: number;
    needs_review_count: number;
    score: number;
    total_score: number;
    score_percentage: number | null;
    latest_submitted_at: string | null;
    review_url: string;
};

export type ActivityAnswerReview = {
    activity_id: number;
    activity_title: string;
    activity_type: string;
    activity_instruction: string | null;
    sort_order: number;
    answer: unknown;
    correct_answer: unknown;
    is_correct: boolean | null;
    score: number | null;
    record_score: boolean;
    feedback: string | null;
    submitted_at: string | null;
    has_answer: boolean;
};

export type Summary = {
    students_count: number;
    lessons_count: number;
    questions_count: number;
    average_progress: number | null;
    average_pretest: number | null;
    average_posttest: number | null;
    average_lesson_score: number | null;
};

export type QuestionFormData = {
    lesson_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: AnswerKey;
    explanation: string;
};

export type TeacherPanel = {
    id: Panel;
    title: string;
    description: string;
    icon: LucideIcon;
};
