export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SectionContentType = 'text' | 'slides';

export type LessonSection = {
    id: string;
    title: string;
    content: string;
    content_type: SectionContentType;
    sort_order: number;
    is_collapsible: boolean;
    media: LessonMedia[];
    activities: LessonActivity[];
};

export type LessonMedia = {
    id: string;
    type: 'image' | 'video' | 'link' | 'slides';
    source: 'url' | 'upload';
    url: string;
    caption: string;
    file?: File | null;
    preview_url?: string;
    upload_name?: string;
    cue_points?: CuePoint[];
};

export type CuePointType = 'quiz_mcq' | 'quiz_open' | 'pause_reflect' | 'info';

export type CuePoint = {
    id: string;
    timestamp_seconds: number;
    type: CuePointType;
    question: string | null;
    options: string[];
    correct_option: string | null;
    explanation: string | null;
    content: string | null;
};

export type CuePointSubmitItem = Omit<CuePoint, 'id'>;

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
    is_correct: boolean;
};

export type LessonActivity = {
    id: string;
    type: ActivityType;
    title: string;
    instruction: string;
    question?: string;
    statement?: string;
    sentence?: string;
    blank_label?: string;
    prompt?: string;
    choices?: string[];
    pairs?: MatchingPair[];
    items?: string[];
    cards?: ClickableCard[];
    correct_answer?: string | boolean | string[] | MatchingPair[] | null;
    explanation?: string;
    record_score?: boolean;
};

export type AiSuggestionType =
    | 'expanded_explanation'
    | 'lesson_section'
    | 'section_activity'
    | 'mini_quiz'
    | 'true_false'
    | 'fill_blank'
    | 'matching'
    | 'sequencing'
    | 'reflection'
    | 'clickable_activity'
    | 'media_suggestion'
    | 'summary';

export type AiSuggestionPayload = {
    type?: ActivityType;
    payload?: Partial<LessonActivity>;
    section_title?: string;
    activity?: Partial<LessonActivity> & {
        type?: ActivityType;
        payload?: Partial<LessonActivity>;
    };
    title?: string;
    content?: string;
    sort_order?: number;
    is_collapsible?: boolean;
    media_type?: LessonMedia['type'];
    url?: string;
    caption?: string;
    instruction?: string;
    question?: string;
    statement?: string;
    sentence?: string;
    blank_label?: string;
    prompt?: string;
    choices?: string[];
    pairs?: MatchingPair[];
    items?: string[];
    cards?: ClickableCard[];
    correct_answer?: LessonActivity['correct_answer'];
    explanation?: string;
};

export type AiSuggestion = {
    id: string;
    backend_id?: number;
    type: AiSuggestionType;
    title: string;
    content: string;
    payload?: AiSuggestionPayload;
    status?: 'pending' | 'accepted' | 'discarded';
};

export type LessonMediaSubmitItem = {
    id?: string;
    type: LessonMedia['type'];
    url: string;
    caption: string;
    file?: File | null;
    sort_order: number;
    cue_points?: CuePointSubmitItem[];
};

export type LessonSubmitPayload = {
    title: string;
    subject: string;
    topic: string;
    difficulty_level: Difficulty;
    is_published: boolean;
    sections: Array<
        Omit<LessonSection, 'id' | 'media' | 'activities'> & {
            media: LessonMediaSubmitItem[];
            activities: Array<
                Omit<LessonActivity, 'id'> & { sort_order: number }
            >;
        }
    >;
    media: LessonMediaSubmitItem[];
    activities: Array<Omit<LessonActivity, 'id'> & { sort_order: number }>;
    _method?: 'put';
};

export type InitialLesson = {
    id: number;
    title: string;
    subject: string | null;
    topic: string | null;
    difficulty_level: Difficulty;
    is_published: boolean;
    sections?: LessonSection[];
    media?: LessonMedia[];
    activities?: LessonActivity[];
};

export type AiSuggestionResponse = {
    suggestions?: Array<
        Omit<AiSuggestion, 'id' | 'backend_id' | 'type'> & {
            id: number;
            type: AiSuggestionType;
        }
    >;
};

export type CreateTeacherLessonProps = {
    lesson?: InitialLesson;
};
