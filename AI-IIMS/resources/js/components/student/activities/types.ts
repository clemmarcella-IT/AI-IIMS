export type ActivityType =
    | 'mini_quiz'
    | 'true_false'
    | 'fill_blank'
    | 'matching'
    | 'sequencing'
    | 'reflection'
    | 'clickable_activity';

export type MatchingPair = {
    left: string;
    right: string;
};

export type ClickableCard = {
    label: string;
    description: string;
    is_correct?: boolean;
};

export type ActivityPayload = {
    question?: string;
    choices?: string[];
    statement?: string;
    sentence?: string;
    blank_label?: string;
    prompt?: string;
    pairs?: MatchingPair[];
    items?: string[];
    cards?: ClickableCard[];
};

export type ActivitySubmission = {
    is_correct: boolean | null;
    score: number | null;
    feedback: string | null;
    attempt_number: number;
    first_score: number | null;
    mastered: boolean;
};

export type StudentActivity = {
    id: number | string;
    type: ActivityType;
    title: string;
    instruction: string;
    payload: ActivityPayload;
    correct_answer?: unknown;
    explanation?: string | null;
    submitted_answer: unknown;
    submission: ActivitySubmission | null;
};

export type SubmitResult = ActivitySubmission & {
    correct_answer?: unknown;
    flow?: unknown;
};
