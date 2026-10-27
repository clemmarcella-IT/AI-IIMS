export type CuePointType = 'quiz_mcq' | 'quiz_open' | 'pause_reflect' | 'info';

export type VideoCuePoint = {
    id: number;
    timestamp_seconds: number;
    type: CuePointType;
    question: string | null;
    options: string[];
    content: string | null;
    answered: boolean;
};

export type VideoMedia = {
    id: number;
    type: 'video';
    url: string;
    caption: string | null;
    cue_points: VideoCuePoint[];
};
