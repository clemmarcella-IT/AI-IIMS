import type { PendingVisit } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronRight,
    Eye,
    FileQuestion,
    ListChecks,
    MessageSquare,
    MousePointerClick,
    Pencil,
    Plus,
    Presentation,
    Save,
    Sparkles,
    Trash2,
    Upload,
    Wand2,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    ensureSlideDeck,
    hasSlideDeck,
    SlideDeckEditor,
    slideDeckHasContent,
} from '@/components/lesson-slides';
import { dashboard as teacherDashboard } from '@/routes/teacher';
import { index as teacherLessons } from '@/routes/teacher/lessons';

import { ActivityEditor } from './create/ActivityEditor';
import {
    activityLabels,
    buildActivity,
    createId,
    defaultChoices,
    findOversizedMediaFile,
    getCsrfToken,
    lessonPayloadSignature,
    maxMediaUploadLabel,
    nextSortOrder,
    normalizeAnswerKey,
    normalizeCards,
    normalizeChoices,
    normalizeItems,
    normalizeMedia,
    normalizePairs,
    serializeActivityForSubmit,
    serializeMediaForSubmit,
    suggestionLabels,
} from './create/helpers';
import { RichTextEditor } from './create/RichTextEditor';
import { SectionMediaEditor } from './create/SectionMediaEditor';
import type {
    ActivityType,
    AiSuggestion,
    AiSuggestionResponse,
    ClickableCard,
    CreateTeacherLessonProps,
    Difficulty,
    LessonActivity,
    LessonMedia,
    LessonSection,
    LessonSubmitPayload,
    MatchingPair,
} from './create/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from './create/ui';
import {
    EmptyBuilderState,
    SectionAccordion,
    StudentLessonPreview,
    SuggestionPreview,
} from './create/views';

type LessonTemplate = {
    name: string;
    description: string;
    sections: Array<
        Pick<LessonSection, 'title' | 'content' | 'is_collapsible'> & {
            content_type?: LessonSection['content_type'];
            activities?: Partial<LessonActivity>[];
        }
    >;
    activities?: Partial<LessonActivity>[];
};

type ReadinessItem = {
    id: string;
    label: string;
    tab: string;
    done: boolean;
};

const lessonTemplates: LessonTemplate[] = [
    {
        name: 'Short Lesson',
        description: 'Intro, guided example, quick check, and reflection.',
        sections: [
            {
                title: 'Warm-up',
                content:
                    '<p>Start with a short question that connects this lesson to what students already know.</p>',
                is_collapsible: true,
            },
            {
                title: 'Core Idea',
                content:
                    '<p>Explain the main concept in student-friendly language. Add one concrete example.</p>',
                is_collapsible: true,
                activities: [
                    {
                        type: 'mini_quiz',
                        title: 'Quick Check',
                        instruction: 'Answer the question.',
                    },
                ],
            },
            {
                title: 'Practice',
                content:
                    '<p>Give students a guided practice task or scenario.</p>',
                is_collapsible: true,
            },
        ],
        activities: [
            {
                type: 'reflection',
                title: 'Exit Reflection',
                instruction: 'Reflect on the lesson.',
                prompt: 'What is one idea from this lesson that you can explain in your own words?',
                record_score: false,
            },
        ],
    },
    {
        name: 'Concept + Practice',
        description: 'Explain, model, practice, check understanding.',
        sections: [
            {
                title: 'Concept',
                content:
                    '<p>Introduce the concept and define important terms.</p>',
                is_collapsible: true,
            },
            {
                title: 'Worked Example',
                content: '<p>Show a complete example step by step.</p>',
                is_collapsible: true,
            },
            {
                title: 'Independent Practice',
                content: '<p>Ask students to apply the idea on their own.</p>',
                is_collapsible: true,
                activities: [
                    {
                        type: 'fill_blank',
                        title: 'Practice Check',
                        instruction: 'Complete the missing idea.',
                    },
                ],
            },
        ],
    },
    {
        name: 'Review Lesson',
        description: 'Recall, sort ideas, address misconceptions.',
        sections: [
            {
                title: 'Recall',
                content:
                    '<p>Ask students to remember key ideas from the previous lesson.</p>',
                is_collapsible: true,
                activities: [
                    {
                        type: 'true_false',
                        title: 'Recall Check',
                        instruction:
                            'Decide whether the statement is true or false.',
                    },
                ],
            },
            {
                title: 'Common Misconceptions',
                content:
                    '<p>Explain two or three mistakes students often make and how to avoid them.</p>',
                is_collapsible: true,
            },
            {
                title: 'Synthesis',
                content:
                    '<p>Connect the reviewed ideas into one bigger understanding.</p>',
                is_collapsible: true,
            },
        ],
    },
];

export default function CreateTeacherLesson({
    lesson: initialLesson,
}: CreateTeacherLessonProps) {
    const initialSections = useMemo(
        () =>
            (initialLesson?.sections ?? []).map((section, index) => ({
                ...section,
                content_type:
                    section.content_type ??
                    (section.content.includes('data-lesson-slides')
                        ? 'slides'
                        : 'text'),
                media:
                    (
                        section.media ??
                        (index === 0 ? initialLesson?.media : [])
                    )?.map(normalizeMedia) ?? [],
                activities: section.activities ?? [],
            })),
        [initialLesson],
    );
    const initialActivities = useMemo(
        () => initialLesson?.activities ?? [],
        [initialLesson],
    );
    const [title, setTitle] = useState(initialLesson?.title ?? '');
    const [subject, setSubject] = useState(initialLesson?.subject ?? '');
    const [topic, setTopic] = useState(initialLesson?.topic ?? '');
    const [difficulty, setDifficulty] = useState<Difficulty>(
        initialLesson?.difficulty_level ?? 'beginner',
    );
    const [lessonLength, setLessonLength] = useState('20-30 minutes');
    const [learningGoal, setLearningGoal] = useState('');
    const [isPublished, setIsPublished] = useState(
        initialLesson?.is_published ?? false,
    );
    const [sections, setSections] = useState<LessonSection[]>(initialSections);
    const [activities, setActivities] =
        useState<LessonActivity[]>(initialActivities);
    const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
    const [viewingSuggestion, setViewingSuggestion] =
        useState<AiSuggestion | null>(null);
    const [editingSuggestion, setEditingSuggestion] =
        useState<AiSuggestion | null>(null);
    const [editedSuggestion, setEditedSuggestion] =
        useState<AiSuggestion | null>(null);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] =
        useState(false);
    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
    const [generatingSectionActivityId, setGeneratingSectionActivityId] =
        useState<string | null>(null);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [draftError, setDraftError] = useState<string | null>(null);
    const [autosaveMessage, setAutosaveMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('basic-info');
    const [previewChecked, setPreviewChecked] = useState(false);
    const [savingAction, setSavingAction] = useState<
        'draft' | 'publish' | null
    >(null);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [pendingLeaveVisit, setPendingLeaveVisit] =
        useState<PendingVisit | null>(null);
    const [savedSignature, setSavedSignature] = useState(() =>
        lessonPayloadSignature({
            title: initialLesson?.title ?? '',
            subject: initialLesson?.subject ?? '',
            topic: initialLesson?.topic ?? '',
            difficulty_level: initialLesson?.difficulty_level ?? 'beginner',
            is_published: initialLesson?.is_published ?? false,
            sections: [...initialSections]
                .sort((first, second) => first.sort_order - second.sort_order)
                .map(
                    ({
                        title,
                        content,
                        content_type,
                        sort_order,
                        is_collapsible,
                        media,
                        activities,
                    }) => ({
                        title,
                        content,
                        content_type,
                        sort_order,
                        is_collapsible,
                        media: media.map(serializeMediaForSubmit),
                        activities: activities.map(serializeActivityForSubmit),
                    }),
                ),
            media: [],
            activities: initialActivities.map(serializeActivityForSubmit),
        }),
    );
    const isSavingVisit = useRef(false);
    const allowNextLeaveVisit = useRef(false);
    const suppressUnsavedPromptUntil = useRef(0);
    const lessonBuilderTopRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const sectionsEndRef = useRef<HTMLDivElement>(null);

    const sortedSections = useMemo(
        () =>
            [...sections].sort(
                (first, second) => first.sort_order - second.sort_order,
            ),
        [sections],
    );

    const scrollToElement = (
        element: HTMLElement | null,
        block: ScrollLogicalPosition = 'start',
    ) => {
        element?.scrollIntoView({
            behavior: 'smooth',
            block,
        });
    };

    const scrollToSection = (sectionId: string) => {
        scrollToElement(sectionRefs.current[sectionId] ?? null);
    };

    const goToBuilderTab = (tab: string) => {
        setActiveTab(tab);

        if (tab === 'preview') {
            setPreviewChecked(true);
        }
    };

    const buildLessonPayload = useCallback(
        (published: boolean): LessonSubmitPayload => ({
            title,
            subject,
            topic,
            difficulty_level: difficulty,
            is_published: published,
            sections: sortedSections.map(
                ({
                    title,
                    content,
                    content_type,
                    sort_order,
                    is_collapsible,
                    media,
                    activities,
                }) => ({
                    title,
                    content,
                    content_type,
                    sort_order,
                    is_collapsible,
                    media: media.map(serializeMediaForSubmit),
                    activities: activities.map(serializeActivityForSubmit),
                }),
            ),
            media: [],
            activities: activities.map(serializeActivityForSubmit),
        }),
        [activities, difficulty, sortedSections, subject, title, topic],
    );

    const currentLessonSignature = useMemo(
        () => lessonPayloadSignature(buildLessonPayload(isPublished)),
        [buildLessonPayload, isPublished],
    );

    const hasUnsavedChanges = savedSignature !== currentLessonSignature;

    const applyDraftPayload = (payload: Partial<LessonSubmitPayload>) => {
        setTitle(payload.title ?? '');
        setSubject(payload.subject ?? '');
        setTopic(payload.topic ?? '');
        setDifficulty(payload.difficulty_level ?? 'beginner');
        setIsPublished(Boolean(payload.is_published));
        setSections(
            (payload.sections ?? []).map((section, sectionIndex) => ({
                id: createId('section'),
                title: section.title ?? '',
                content: section.content ?? '',
                content_type: section.content_type ?? 'text',
                sort_order: sectionIndex + 1,
                is_collapsible: section.is_collapsible ?? true,
                media: (section.media ?? []).map((mediaItem) =>
                    normalizeMedia({
                        id: createId('media'),
                        type: mediaItem.type,
                        source: 'url',
                        url: mediaItem.url ?? '',
                        caption: mediaItem.caption ?? '',
                        file: null,
                        cue_points: (mediaItem.cue_points ?? []).map(
                            (cuePoint) => ({
                                ...cuePoint,
                                id: createId('cue'),
                            }),
                        ),
                    }),
                ),
                activities: (section.activities ?? []).map((activity) =>
                    buildActivity(activity.type, activity),
                ),
            })),
        );
        setActivities(
            (payload.activities ?? []).map((activity) =>
                buildActivity(activity.type, activity),
            ),
        );
    };

    useEffect(() => {
        if (sections.length > 0) {
            sectionsEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [sections.length]);

    useEffect(() => {
        const removeBeforeListener = router.on('before', (event) => {
            if (allowNextLeaveVisit.current) {
                allowNextLeaveVisit.current = false;

                return;
            }

            if (
                !hasUnsavedChanges ||
                isSavingVisit.current ||
                Date.now() < suppressUnsavedPromptUntil.current
            ) {
                return;
            }

            event.preventDefault();
            setPendingLeaveVisit(event.detail.visit);
        });

        return () => {
            removeBeforeListener();
        };
    }, [hasUnsavedChanges]);

    const closeUnsavedChangesDialog = () => {
        setPendingLeaveVisit(null);
    };

    const leaveWithUnsavedChanges = () => {
        if (!pendingLeaveVisit) {
            return;
        }

        const visit = pendingLeaveVisit;

        setPendingLeaveVisit(null);
        allowNextLeaveVisit.current = true;

        router.visit(visit.url, {
            async: visit.async,
            data: visit.data,
            errorBag: visit.errorBag,
            except: visit.except,
            forceFormData: visit.forceFormData,
            fresh: visit.fresh,
            headers: visit.headers,
            invalidateCacheTags: visit.invalidateCacheTags,
            method: visit.method,
            only: visit.only,
            preserveErrors: visit.preserveErrors,
            preserveScroll: visit.preserveScroll,
            preserveState: visit.preserveState,
            preserveUrl: visit.preserveUrl,
            queryStringArrayFormat: visit.queryStringArrayFormat,
            replace: visit.replace,
            reset: visit.reset,
            showProgress: visit.showProgress,
            viewTransition: visit.viewTransition,
        });
    };

    const saveLesson = (published: boolean) => {
        const action = published ? 'publish' : 'draft';
        const payload = buildLessonPayload(published);
        const oversizedFile = findOversizedMediaFile(payload);

        if (oversizedFile) {
            setFormErrors([
                `"${oversizedFile.name}" is too large. Media uploads must be ${maxMediaUploadLabel} or smaller. Choose a smaller file or use a URL instead.`,
            ]);

            return;
        }

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => {
                setFormErrors([]);
                setSavingAction(action);
            },
            onSuccess: () => {
                setIsPublished(published);
                setSavedSignature(lessonPayloadSignature(payload));
                setAutosaveMessage(
                    published ? 'Published successfully.' : 'Draft saved.',
                );
            },
            onError: (errors: Record<string, string>) => {
                suppressUnsavedPromptUntil.current = 0;
                setFormErrors(Object.values(errors).map(String));
            },
            onFinish: () => {
                window.setTimeout(() => {
                    isSavingVisit.current = false;
                    suppressUnsavedPromptUntil.current = 0;
                }, 500);

                setSavingAction(null);
            },
        };

        isSavingVisit.current = true;
        suppressUnsavedPromptUntil.current = Date.now() + 5000;

        if (initialLesson) {
            router.post(
                `/teacher/lessons/${initialLesson.id}`,
                {
                    ...payload,
                    _method: 'put',
                },
                options,
            );

            return;
        }

        router.post('/teacher/lessons', payload, options);
    };

    const buildAiSuggestionPayload = () => ({
        ...(initialLesson ? { lesson_id: initialLesson.id } : {}),
        title,
        subject,
        topic,
        difficulty_level: difficulty,
        sections: buildLessonPayload(false).sections,
        media: buildLessonPayload(false).media,
        activities: buildLessonPayload(false).activities,
    });

    const generateAiSuggestions = async () => {
        setIsGeneratingSuggestions(true);
        setSuggestionError(null);

        try {
            const response = await fetch(
                '/teacher/lessons/ai-suggestions/generate',
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(buildAiSuggestionPayload()),
                },
            );

            const data = (await response.json()) as AiSuggestionResponse & {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(
                    data.message ?? 'Unable to generate AI suggestions.',
                );
            }

            setAiSuggestions(
                (data.suggestions ?? []).map((suggestion) => ({
                    ...suggestion,
                    id: String(suggestion.id),
                    backend_id: suggestion.id,
                })),
            );
        } catch (error) {
            setSuggestionError(
                error instanceof Error
                    ? error.message
                    : 'Unable to generate AI suggestions.',
            );
        } finally {
            setIsGeneratingSuggestions(false);
        }
    };

    const markSuggestionAccepted = async (suggestion: AiSuggestion) => {
        if (!suggestion.backend_id) {
            return;
        }

        await fetch(
            `/teacher/lessons/ai-suggestions/${suggestion.backend_id}/accept`,
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        );
    };

    const markSuggestionDiscarded = async (suggestion: AiSuggestion) => {
        if (!suggestion.backend_id) {
            return;
        }

        await fetch(
            `/teacher/lessons/ai-suggestions/${suggestion.backend_id}/discard`,
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        );
    };

    const generateLessonDraft = async () => {
        const seedTopic = topic.trim() || title.trim();

        if (!seedTopic) {
            setDraftError('Add a topic or title before generating a draft.');
            setActiveTab('basic-info');

            return;
        }

        setIsGeneratingDraft(true);
        setDraftError(null);

        try {
            const response = await fetch(
                '/teacher/lessons/ai-suggestions/draft',
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        title,
                        subject,
                        topic: seedTopic,
                        difficulty_level: difficulty,
                        lesson_length: lessonLength,
                        learning_goal: learningGoal,
                    }),
                },
            );

            const data = (await response.json()) as {
                draft?: Partial<LessonSubmitPayload>;
                message?: string;
            };

            if (!response.ok || !data.draft) {
                throw new Error(
                    data.message ?? 'Unable to generate lesson draft.',
                );
            }

            applyDraftPayload({
                ...data.draft,
                is_published: false,
            });
            setActiveTab('content-sections');
            setAutosaveMessage('AI draft added. Review it before publishing.');
        } catch (error) {
            setDraftError(
                error instanceof Error
                    ? error.message
                    : 'Unable to generate lesson draft.',
            );
        } finally {
            setIsGeneratingDraft(false);
        }
    };

    const addSection = (section?: Partial<LessonSection>) => {
        setSections((currentSections) => [
            ...currentSections,
            {
                id: createId('section'),
                title: section?.title ?? '',
                content: section?.content ?? '',
                content_type: section?.content_type ?? 'text',
                sort_order:
                    section?.sort_order ?? nextSortOrder(currentSections),
                is_collapsible: section?.is_collapsible ?? true,
                media: section?.media ?? [],
                activities: section?.activities ?? [],
            },
        ]);
    };

    const updateSection = (
        id: string,
        patch: Partial<Omit<LessonSection, 'id'>>,
    ) => {
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === id ? { ...section, ...patch } : section,
            ),
        );
    };

    const removeSection = (id: string) => {
        setSections((currentSections) =>
            currentSections.filter((section) => section.id !== id),
        );
    };

    const reindexSections = (nextSections: LessonSection[]) =>
        nextSections.map((section, index) => ({
            ...section,
            sort_order: index + 1,
        }));

    const moveSection = (id: string, direction: -1 | 1) => {
        setSections((currentSections) => {
            const nextSections = [...currentSections].sort(
                (first, second) => first.sort_order - second.sort_order,
            );
            const currentIndex = nextSections.findIndex(
                (section) => section.id === id,
            );
            const nextIndex = currentIndex + direction;

            if (
                currentIndex < 0 ||
                nextIndex < 0 ||
                nextIndex >= nextSections.length
            ) {
                return currentSections;
            }

            const [section] = nextSections.splice(currentIndex, 1);
            nextSections.splice(nextIndex, 0, section);

            return reindexSections(nextSections);
        });
    };

    const applyTemplate = (template: LessonTemplate) => {
        setSections(
            template.sections.map((section, index) => ({
                id: createId('section'),
                title: section.title,
                content: section.content,
                content_type: section.content_type ?? 'text',
                sort_order: index + 1,
                is_collapsible: section.is_collapsible,
                media: [],
                activities: (section.activities ?? []).map((activity) =>
                    buildActivity(
                        (activity.type ?? 'reflection') as ActivityType,
                        activity,
                    ),
                ),
            })),
        );
        setActivities(
            (template.activities ?? []).map((activity) =>
                buildActivity(
                    (activity.type ?? 'reflection') as ActivityType,
                    activity,
                ),
            ),
        );
        setActiveTab('content-sections');
        setAutosaveMessage(`${template.name} template applied.`);
    };

    const createMedia = (mediaItem?: Partial<LessonMedia>): LessonMedia => ({
        id: createId('media'),
        type: mediaItem?.type ?? 'image',
        source: mediaItem?.source ?? 'url',
        url: mediaItem?.url ?? '',
        caption: mediaItem?.caption ?? '',
        file: mediaItem?.file ?? null,
        preview_url: mediaItem?.preview_url,
        upload_name: mediaItem?.upload_name,
        cue_points: mediaItem?.cue_points ?? [],
    });

    const addSectionMedia = (
        sectionId: string,
        mediaItem?: Partial<LessonMedia>,
    ) => {
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          media: [...section.media, createMedia(mediaItem)],
                      }
                    : section,
            ),
        );
    };

    const addMediaToFirstSection = (mediaItem?: Partial<LessonMedia>) => {
        setSections((currentSections) => {
            if (currentSections.length === 0) {
                return [
                    {
                        id: createId('section'),
                        title: 'Media resources',
                        content: '',
                        content_type: 'text',
                        sort_order: 1,
                        is_collapsible: true,
                        media: [createMedia(mediaItem)],
                        activities: [],
                    },
                ];
            }

            return currentSections.map((section, index) =>
                index === 0
                    ? {
                          ...section,
                          media: [...section.media, createMedia(mediaItem)],
                      }
                    : section,
            );
        });
    };

    const updateSectionMedia = (
        sectionId: string,
        mediaId: string,
        patch: Partial<Omit<LessonMedia, 'id'>>,
    ) => {
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          media: section.media.map((mediaItem) =>
                              mediaItem.id === mediaId
                                  ? { ...mediaItem, ...patch }
                                  : mediaItem,
                          ),
                      }
                    : section,
            ),
        );
    };

    const removeSectionMedia = (sectionId: string, mediaId: string) => {
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          media: section.media.filter(
                              (mediaItem) => mediaItem.id !== mediaId,
                          ),
                      }
                    : section,
            ),
        );
    };

    const createActivity = (
        type: ActivityType,
        activity?: Partial<LessonActivity>,
    ): LessonActivity => buildActivity(type, activity);

    const addActivity = (
        type: ActivityType,
        activity?: Partial<LessonActivity>,
    ) => {
        setActivities((currentActivities) => [
            ...currentActivities,
            createActivity(type, activity),
        ]);
    };

    const updateActivity = (
        id: string,
        patch: Partial<Omit<LessonActivity, 'id'>>,
    ) => {
        setActivities((currentActivities) =>
            currentActivities.map((activity) =>
                activity.id === id ? { ...activity, ...patch } : activity,
            ),
        );
    };

    const updateActivityChoice = (
        activity: LessonActivity,
        choiceIndex: number,
        value: string,
    ) => {
        const nextChoices = normalizeChoices(activity.choices);
        nextChoices[choiceIndex] = value;
        updateActivity(activity.id, { choices: nextChoices });
    };

    const updateActivityPair = (
        activity: LessonActivity,
        pairIndex: number,
        field: keyof MatchingPair,
        value: string,
    ) => {
        const pairs = normalizePairs(activity.pairs);
        pairs[pairIndex] = { ...pairs[pairIndex], [field]: value };
        updateActivity(activity.id, { pairs, correct_answer: pairs });
    };

    const addActivityPair = (activity: LessonActivity) => {
        const pairs = [
            ...normalizePairs(activity.pairs),
            { left: '', right: '' },
        ];
        updateActivity(activity.id, { pairs, correct_answer: pairs });
    };

    const removeActivityPair = (
        activity: LessonActivity,
        pairIndex: number,
    ) => {
        const pairs = normalizePairs(activity.pairs).filter(
            (_, index) => index !== pairIndex,
        );
        updateActivity(activity.id, { pairs, correct_answer: pairs });
    };

    const updateActivityItem = (
        activity: LessonActivity,
        itemIndex: number,
        value: string,
    ) => {
        const items = normalizeItems(activity.items);
        items[itemIndex] = value;
        updateActivity(activity.id, { items, correct_answer: items });
    };

    const addActivityItem = (activity: LessonActivity) => {
        const items = [...normalizeItems(activity.items), ''];
        updateActivity(activity.id, { items, correct_answer: items });
    };

    const removeActivityItem = (
        activity: LessonActivity,
        itemIndex: number,
    ) => {
        const items = normalizeItems(activity.items).filter(
            (_, index) => index !== itemIndex,
        );
        updateActivity(activity.id, { items, correct_answer: items });
    };

    const updateActivityCard = (
        activity: LessonActivity,
        cardIndex: number,
        patch: Partial<ClickableCard>,
    ) => {
        const cards = normalizeCards(activity.cards);
        cards[cardIndex] = { ...cards[cardIndex], ...patch };
        updateActivity(activity.id, {
            cards,
            correct_answer: cards
                .filter((card) => card.is_correct)
                .map((card) => card.label),
        });
    };

    const addActivityCard = (activity: LessonActivity) => {
        const cards = [
            ...normalizeCards(activity.cards),
            { label: '', description: '', is_correct: false },
        ];
        updateActivity(activity.id, { cards });
    };

    const removeActivityCard = (
        activity: LessonActivity,
        cardIndex: number,
    ) => {
        const cards = normalizeCards(activity.cards).filter(
            (_, index) => index !== cardIndex,
        );
        updateActivity(activity.id, {
            cards,
            correct_answer: cards
                .filter((card) => card.is_correct)
                .map((card) => card.label),
        });
    };

    const removeActivity = (id: string) => {
        setActivities((currentActivities) =>
            currentActivities.filter((activity) => activity.id !== id),
        );
    };

    const duplicateActivity = (activity: LessonActivity) => {
        setActivities((currentActivities) => [
            ...currentActivities,
            {
                ...activity,
                id: createId('activity'),
                title: `${activity.title || 'Activity'} Copy`,
            },
        ]);
    };

    const updateSectionActivities = (
        sectionId: string,
        updater: (activities: LessonActivity[]) => LessonActivity[],
    ) => {
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === sectionId
                    ? { ...section, activities: updater(section.activities) }
                    : section,
            ),
        );
    };

    const addSectionActivity = (
        sectionId: string,
        type: ActivityType,
        activity?: Partial<LessonActivity>,
    ) => {
        updateSectionActivities(sectionId, (currentActivities) => [
            ...currentActivities,
            createActivity(type, activity),
        ]);
    };

    const generateSectionActivity = async (
        section: LessonSection,
        preferredType?: ActivityType,
    ) => {
        setGeneratingSectionActivityId(section.id);
        setSuggestionError(null);

        try {
            const response = await fetch(
                '/teacher/lessons/ai-suggestions/section-activity',
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        title,
                        subject,
                        topic,
                        difficulty_level: difficulty,
                        section: {
                            title: section.title,
                            content: section.content,
                        },
                        preferred_type: preferredType,
                    }),
                },
            );
            const data = (await response.json()) as {
                activity?: Partial<LessonActivity> & { type?: ActivityType };
                message?: string;
            };

            if (!response.ok || !data.activity?.type) {
                throw new Error(
                    data.message ?? 'Unable to generate section activity.',
                );
            }

            addSectionActivity(section.id, data.activity.type, data.activity);
            setAutosaveMessage('AI activity added to this section.');
        } catch (error) {
            setSuggestionError(
                error instanceof Error
                    ? error.message
                    : 'Unable to generate section activity.',
            );
        } finally {
            setGeneratingSectionActivityId(null);
        }
    };

    const updateSectionActivity = (
        sectionId: string,
        activityId: string,
        patch: Partial<Omit<LessonActivity, 'id'>>,
    ) => {
        updateSectionActivities(sectionId, (currentActivities) =>
            currentActivities.map((activity) =>
                activity.id === activityId
                    ? { ...activity, ...patch }
                    : activity,
            ),
        );
    };

    const removeSectionActivity = (sectionId: string, activityId: string) => {
        updateSectionActivities(sectionId, (currentActivities) =>
            currentActivities.filter((activity) => activity.id !== activityId),
        );
    };

    const duplicateSectionActivity = (
        sectionId: string,
        activity: LessonActivity,
    ) => {
        updateSectionActivities(sectionId, (currentActivities) => [
            ...currentActivities,
            {
                ...activity,
                id: createId('activity'),
                title: `${activity.title || 'Activity'} Copy`,
            },
        ]);
    };

    const updateSectionActivityChoice = (
        sectionId: string,
        activity: LessonActivity,
        choiceIndex: number,
        value: string,
    ) => {
        const nextChoices = normalizeChoices(activity.choices);
        nextChoices[choiceIndex] = value;
        updateSectionActivity(sectionId, activity.id, { choices: nextChoices });
    };

    const updateSectionActivityPair = (
        sectionId: string,
        activity: LessonActivity,
        pairIndex: number,
        field: keyof MatchingPair,
        value: string,
    ) => {
        const pairs = normalizePairs(activity.pairs);
        pairs[pairIndex] = { ...pairs[pairIndex], [field]: value };
        updateSectionActivity(sectionId, activity.id, {
            pairs,
            correct_answer: pairs,
        });
    };

    const addSectionActivityPair = (
        sectionId: string,
        activity: LessonActivity,
    ) => {
        const pairs = [
            ...normalizePairs(activity.pairs),
            { left: '', right: '' },
        ];
        updateSectionActivity(sectionId, activity.id, {
            pairs,
            correct_answer: pairs,
        });
    };

    const removeSectionActivityPair = (
        sectionId: string,
        activity: LessonActivity,
        pairIndex: number,
    ) => {
        const pairs = normalizePairs(activity.pairs).filter(
            (_, index) => index !== pairIndex,
        );
        updateSectionActivity(sectionId, activity.id, {
            pairs,
            correct_answer: pairs,
        });
    };

    const updateSectionActivityItem = (
        sectionId: string,
        activity: LessonActivity,
        itemIndex: number,
        value: string,
    ) => {
        const items = normalizeItems(activity.items);
        items[itemIndex] = value;
        updateSectionActivity(sectionId, activity.id, {
            items,
            correct_answer: items,
        });
    };

    const addSectionActivityItem = (
        sectionId: string,
        activity: LessonActivity,
    ) => {
        const items = [...normalizeItems(activity.items), ''];
        updateSectionActivity(sectionId, activity.id, {
            items,
            correct_answer: items,
        });
    };

    const removeSectionActivityItem = (
        sectionId: string,
        activity: LessonActivity,
        itemIndex: number,
    ) => {
        const items = normalizeItems(activity.items).filter(
            (_, index) => index !== itemIndex,
        );
        updateSectionActivity(sectionId, activity.id, {
            items,
            correct_answer: items,
        });
    };

    const updateSectionActivityCard = (
        sectionId: string,
        activity: LessonActivity,
        cardIndex: number,
        patch: Partial<ClickableCard>,
    ) => {
        const cards = normalizeCards(activity.cards);
        cards[cardIndex] = { ...cards[cardIndex], ...patch };
        updateSectionActivity(sectionId, activity.id, {
            cards,
            correct_answer: cards
                .filter((card) => card.is_correct)
                .map((card) => card.label),
        });
    };

    const addSectionActivityCard = (
        sectionId: string,
        activity: LessonActivity,
    ) => {
        const cards = [
            ...normalizeCards(activity.cards),
            { label: '', description: '', is_correct: false },
        ];
        updateSectionActivity(sectionId, activity.id, { cards });
    };

    const removeSectionActivityCard = (
        sectionId: string,
        activity: LessonActivity,
        cardIndex: number,
    ) => {
        const cards = normalizeCards(activity.cards).filter(
            (_, index) => index !== cardIndex,
        );
        updateSectionActivity(sectionId, activity.id, {
            cards,
            correct_answer: cards
                .filter((card) => card.is_correct)
                .map((card) => card.label),
        });
    };

    const addSuggestionActivityToSection = (suggestion: AiSuggestion) => {
        const activityPayload =
            suggestion.payload?.activity ?? suggestion.payload;
        const type = activityPayload?.type;

        if (!type) {
            return;
        }

        const nestedPayload =
            activityPayload?.payload &&
            typeof activityPayload.payload === 'object'
                ? activityPayload.payload
                : {};
        const sectionTitle = suggestion.payload?.section_title?.trim();
        const activity = createActivity(type, {
            ...nestedPayload,
            ...activityPayload,
            title: activityPayload?.title ?? suggestion.title,
            instruction: activityPayload?.instruction ?? suggestion.content,
        });

        setSections((currentSections) => {
            const matchedSection = currentSections.find(
                (section) =>
                    sectionTitle &&
                    section.title.trim().toLowerCase() ===
                        sectionTitle.toLowerCase(),
            );

            if (matchedSection) {
                return currentSections.map((section) =>
                    section.id === matchedSection.id
                        ? {
                              ...section,
                              activities: [...section.activities, activity],
                          }
                        : section,
                );
            }

            return [
                ...currentSections,
                {
                    id: createId('section'),
                    title: sectionTitle || suggestion.title,
                    content: '',
                    content_type: 'text',
                    sort_order: nextSortOrder(currentSections),
                    is_collapsible: true,
                    media: [],
                    activities: [activity],
                },
            ];
        });
    };

    const acceptSuggestion = (suggestion: AiSuggestion) => {
        if (suggestion.type === 'section_activity') {
            addSuggestionActivityToSection(suggestion);
        }

        if (
            suggestion.type === 'lesson_section' ||
            suggestion.type === 'expanded_explanation' ||
            suggestion.type === 'summary'
        ) {
            addSection({
                title: suggestion.payload?.title ?? suggestion.title,
                content: suggestion.payload?.content ?? suggestion.content,
                sort_order: suggestion.payload?.sort_order,
                is_collapsible: suggestion.payload?.is_collapsible ?? true,
            });
        }

        if (suggestion.type === 'mini_quiz') {
            const choices = normalizeChoices(
                suggestion.payload?.choices ?? defaultChoices,
            );

            addActivity('mini_quiz', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? 'Answer the question.',
                question: suggestion.payload?.question ?? suggestion.content,
                choices,
                correct_answer: normalizeAnswerKey(
                    suggestion.payload?.correct_answer,
                    choices,
                ),
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'true_false') {
            addActivity('true_false', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? suggestion.content,
                statement: suggestion.payload?.statement ?? suggestion.content,
                correct_answer:
                    typeof suggestion.payload?.correct_answer === 'boolean'
                        ? suggestion.payload.correct_answer
                        : true,
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'fill_blank') {
            addActivity('fill_blank', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? 'Complete the sentence.',
                sentence: suggestion.payload?.sentence ?? suggestion.content,
                blank_label: suggestion.payload?.blank_label ?? 'missing word',
                correct_answer:
                    typeof suggestion.payload?.correct_answer === 'string'
                        ? suggestion.payload.correct_answer
                        : '',
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'matching') {
            addActivity('matching', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? suggestion.content,
                pairs: normalizePairs(suggestion.payload?.pairs),
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'sequencing') {
            addActivity('sequencing', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? suggestion.content,
                items: normalizeItems(suggestion.payload?.items),
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'reflection') {
            addActivity('reflection', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? suggestion.content,
                prompt: suggestion.payload?.prompt ?? suggestion.content,
            });
        }

        if (suggestion.type === 'clickable_activity') {
            addActivity('clickable_activity', {
                title: suggestion.payload?.title ?? suggestion.title,
                instruction:
                    suggestion.payload?.instruction ?? suggestion.content,
                question: suggestion.payload?.question ?? suggestion.content,
                cards: normalizeCards(suggestion.payload?.cards),
                explanation: suggestion.payload?.explanation ?? '',
            });
        }

        if (suggestion.type === 'media_suggestion') {
            addMediaToFirstSection({
                type: suggestion.payload?.media_type ?? 'image',
                url: suggestion.payload?.url ?? '',
                caption: suggestion.payload?.caption ?? suggestion.content,
            });
        }

        setAiSuggestions((currentSuggestions) =>
            currentSuggestions.filter((item) => item.id !== suggestion.id),
        );
        void markSuggestionAccepted(suggestion);
    };

    const discardSuggestion = (suggestion: AiSuggestion) => {
        setAiSuggestions((currentSuggestions) =>
            currentSuggestions.filter((item) => item.id !== suggestion.id),
        );
        void markSuggestionDiscarded(suggestion);
    };

    const openSuggestionEditor = (suggestion: AiSuggestion) => {
        setEditingSuggestion(suggestion);
        setEditedSuggestion({ ...suggestion });
    };

    const closeSuggestionEditor = () => {
        setEditingSuggestion(null);
        setEditedSuggestion(null);
    };

    const acceptEditedSuggestion = () => {
        if (!editedSuggestion) {
            return;
        }

        acceptSuggestion(editedSuggestion);
        closeSuggestionEditor();
    };

    const plainText = (html: string) =>
        html
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .trim();
    const sectionHasReadyContent = (section: LessonSection) =>
        section.content_type === 'slides'
            ? slideDeckHasContent(section.content) ||
              section.media.some((mediaItem) => mediaItem.type === 'slides')
            : plainText(section.content) !== '';

    const activityIsComplete = (activity: LessonActivity) => {
        if (!activity.title.trim()) {
            return false;
        }

        if (activity.type === 'mini_quiz') {
            return (
                Boolean(activity.question?.trim()) &&
                normalizeChoices(activity.choices).every((choice) =>
                    choice.trim(),
                ) &&
                Boolean(activity.correct_answer)
            );
        }

        if (activity.type === 'true_false') {
            return Boolean(activity.statement?.trim());
        }

        if (activity.type === 'fill_blank') {
            return (
                Boolean(activity.sentence?.trim()) &&
                Boolean(String(activity.correct_answer ?? '').trim())
            );
        }

        if (activity.type === 'matching') {
            return normalizePairs(activity.pairs).every(
                (pair) => pair.left.trim() && pair.right.trim(),
            );
        }

        if (activity.type === 'sequencing') {
            return normalizeItems(activity.items).every((item) => item.trim());
        }

        if (activity.type === 'clickable_activity') {
            return (
                Boolean(activity.question?.trim()) &&
                normalizeCards(activity.cards).some(
                    (card) => card.is_correct,
                ) &&
                normalizeCards(activity.cards).every((card) =>
                    card.label.trim(),
                )
            );
        }

        return Boolean((activity.prompt ?? activity.instruction).trim());
    };

    const readinessItems: ReadinessItem[] = [
        {
            id: 'title',
            label: 'Lesson has a title.',
            tab: 'basic-info',
            done: title.trim() !== '',
        },
        {
            id: 'topic',
            label: 'Topic or subject is filled in.',
            tab: 'basic-info',
            done: topic.trim() !== '' || subject.trim() !== '',
        },
        {
            id: 'sections',
            label: 'At least one content section is ready.',
            tab: 'content-sections',
            done:
                sortedSections.length > 0 &&
                sortedSections.every(
                    (section) =>
                        section.title.trim() !== '' &&
                        sectionHasReadyContent(section),
                ),
        },
        {
            id: 'activities',
            label: 'Activities are complete enough for students.',
            tab: 'content-sections',
            done: [
                ...sortedSections.flatMap((section) => section.activities),
                ...activities,
            ].every(activityIsComplete),
        },
        {
            id: 'preview',
            label: 'Preview has been checked.',
            tab: 'preview',
            done: previewChecked,
        },
    ];
    const incompleteReadinessItems = readinessItems.filter(
        (item) => !item.done,
    );
    const workflowSteps = [
        {
            title: 'Setup',
            description: 'Add the title and topic teachers will recognize.',
            tab: 'basic-info',
            done: readinessItems
                .filter((item) => item.tab === 'basic-info')
                .every((item) => item.done),
        },
        {
            title: 'Build Lesson',
            description: 'Add sections, content, and student activities.',
            tab: 'content-sections',
            done: readinessItems
                .filter((item) => item.tab === 'content-sections')
                .every((item) => item.done),
        },
        {
            title: 'Review & Publish',
            description: 'Preview the student flow before publishing.',
            tab: 'preview',
            done: readinessItems
                .filter((item) => item.tab === 'preview')
                .every((item) => item.done),
        },
    ];
    const nextReadinessItem = incompleteReadinessItems[0];
    const nextWorkflowStep =
        workflowSteps.find((step) => step.tab === nextReadinessItem?.tab) ??
        workflowSteps[workflowSteps.length - 1];
    const completedWorkflowSteps = workflowSteps.filter(
        (step) => step.done,
    ).length;
    const teacherWorkflowPanel = (
        <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-5 dark:border-sidebar-border">
            <CardHeader className="mb-3 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="text-base">
                        Teacher Workflow
                    </CardTitle>
                    <CardDescription>
                        {nextReadinessItem
                            ? nextReadinessItem.label
                            : 'Everything is ready for publishing.'}
                    </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        variant={
                            incompleteReadinessItems.length === 0
                                ? 'secondary'
                                : 'outline'
                        }
                    >
                        {completedWorkflowSteps} of {workflowSteps.length} steps
                    </Badge>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => goToBuilderTab(nextWorkflowStep.tab)}
                    >
                        {incompleteReadinessItems.length === 0
                            ? 'Review Lesson'
                            : `Go to ${nextWorkflowStep.title}`}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-3">
                {workflowSteps.map((step, index) => (
                    <button
                        key={step.tab}
                        type="button"
                        onClick={() => goToBuilderTab(step.tab)}
                        className={`rounded-lg border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5 ${
                            activeTab === step.tab ? 'border-primary' : ''
                        }`}
                    >
                        <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2
                                className={
                                    step.done
                                        ? 'size-4 text-emerald-600'
                                        : 'size-4 text-muted-foreground'
                                }
                                aria-hidden="true"
                            />
                            {index + 1}. {step.title}
                        </span>
                        <span className="mt-1 block text-muted-foreground">
                            {step.description}
                        </span>
                    </button>
                ))}
            </CardContent>
        </Card>
    );
    const sectionNavigatorPanel = (
        <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle>Section Navigator</CardTitle>
                    <CardDescription>
                        Jump between sections while building longer lessons.
                    </CardDescription>
                </div>
                <Button type="button" size="sm" onClick={() => addSection()}>
                    <Plus className="size-4" aria-hidden="true" />
                    Add Section
                </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            scrollToElement(lessonBuilderTopRef.current)
                        }
                    >
                        <ArrowUp className="size-4" aria-hidden="true" />
                        Top
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            scrollToElement(sectionsEndRef.current, 'end')
                        }
                    >
                        <ArrowDown className="size-4" aria-hidden="true" />
                        Bottom
                    </Button>
                </div>

                {sortedSections.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        Section links will appear after you add a section.
                    </p>
                ) : (
                    <div className="flex gap-2 overflow-x-auto pb-1 xl:grid xl:max-h-[calc(100vh-16rem)] xl:overflow-x-visible xl:overflow-y-auto xl:pr-1">
                        {sortedSections.map((section) => (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => scrollToSection(section.id)}
                                className="min-w-52 rounded-lg border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5 xl:min-w-0"
                                aria-label={`Jump to section ${section.sort_order}`}
                            >
                                <span className="block font-medium">
                                    Section {section.sort_order}
                                </span>
                                <span className="mt-1 block truncate text-muted-foreground">
                                    {section.title || 'Untitled section'}
                                </span>
                                <span className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary">
                                        {section.activities.length} activities
                                    </Badge>
                                    <Badge variant="outline">
                                        {section.media.length} media
                                    </Badge>
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
    const endOfLessonActivitiesPanel = (
        <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle>End-of-Lesson Activities</CardTitle>
                    <CardDescription>
                        Use this only for checks or reflections students should
                        answer after all sections. For in-context practice, add
                        the activity inside its section above.
                    </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('mini_quiz')}
                    >
                        <FileQuestion className="size-4" aria-hidden="true" />
                        Mini Quiz
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('reflection')}
                    >
                        <MessageSquare className="size-4" aria-hidden="true" />
                        Reflection
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('true_false')}
                    >
                        <Check className="size-4" aria-hidden="true" />
                        True/False
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('fill_blank')}
                    >
                        <Pencil className="size-4" aria-hidden="true" />
                        Fill Blank
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('matching')}
                    >
                        <ListChecks className="size-4" aria-hidden="true" />
                        Matching
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('sequencing')}
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                        Sequencing
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity('clickable_activity')}
                    >
                        <MousePointerClick
                            className="size-4"
                            aria-hidden="true"
                        />
                        Clickable
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                {activities.length === 0 ? (
                    <EmptyBuilderState
                        icon={ListChecks}
                        title="No end-of-lesson activities"
                        description="Add one only when the activity belongs after all lesson sections."
                    />
                ) : (
                    activities.map((activity, index) => (
                        <ActivityEditor
                            key={activity.id}
                            activity={activity}
                            index={index}
                            onChange={(patch) =>
                                updateActivity(activity.id, patch)
                            }
                            onChoiceChange={(choiceIndex, value) =>
                                updateActivityChoice(
                                    activity,
                                    choiceIndex,
                                    value,
                                )
                            }
                            onPairChange={(pairIndex, field, value) =>
                                updateActivityPair(
                                    activity,
                                    pairIndex,
                                    field,
                                    value,
                                )
                            }
                            onAddPair={() => addActivityPair(activity)}
                            onRemovePair={(pairIndex) =>
                                removeActivityPair(activity, pairIndex)
                            }
                            onItemChange={(itemIndex, value) =>
                                updateActivityItem(activity, itemIndex, value)
                            }
                            onAddItem={() => addActivityItem(activity)}
                            onRemoveItem={(itemIndex) =>
                                removeActivityItem(activity, itemIndex)
                            }
                            onCardChange={(cardIndex, patch) =>
                                updateActivityCard(activity, cardIndex, patch)
                            }
                            onAddCard={() => addActivityCard(activity)}
                            onRemoveCard={(cardIndex) =>
                                removeActivityCard(activity, cardIndex)
                            }
                            onDuplicate={() => duplicateActivity(activity)}
                            onRemove={() => removeActivity(activity.id)}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
    const aiSuggestionsPanel = (
        <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle>AI Suggestions</CardTitle>
                    <CardDescription>
                        Accept section suggestions into the lesson flow; other
                        activity suggestions become end-of-lesson activities.
                    </CardDescription>
                </div>
                <Button
                    type="button"
                    onClick={generateAiSuggestions}
                    disabled={isGeneratingSuggestions || title.trim() === ''}
                >
                    <Sparkles className="size-4" aria-hidden="true" />
                    {isGeneratingSuggestions
                        ? 'Generating...'
                        : 'Generate AI Suggestions'}
                </Button>
            </CardHeader>
            {suggestionError && (
                <CardContent>
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {suggestionError}
                    </p>
                </CardContent>
            )}
            <CardContent className="grid gap-4 md:grid-cols-2">
                {aiSuggestions.length === 0 ? (
                    <div className="md:col-span-2">
                        <EmptyBuilderState
                            icon={Sparkles}
                            title="No suggestions yet"
                            description="Generate suggestions from the current lesson, then accept only what belongs in the student flow."
                        />
                    </div>
                ) : (
                    aiSuggestions.map((suggestion) => (
                        <Card
                            key={suggestion.id}
                            className="border-sidebar-border/70 shadow-none dark:border-sidebar-border"
                        >
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                        {suggestionLabels[suggestion.type]}
                                    </Badge>
                                    {suggestion.type === 'section_activity' &&
                                        suggestion.payload?.section_title && (
                                            <Badge variant="outline">
                                                {
                                                    suggestion.payload
                                                        .section_title
                                                }
                                            </Badge>
                                        )}
                                </div>
                                <CardTitle className="text-base">
                                    {suggestion.title}
                                </CardTitle>
                                <CardDescription className="leading-6">
                                    {suggestion.content}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    onClick={() => acceptSuggestion(suggestion)}
                                >
                                    <Check
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Accept
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        openSuggestionEditor(suggestion)
                                    }
                                >
                                    <Pencil
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setViewingSuggestion(suggestion)
                                    }
                                >
                                    <Eye
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    View
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        discardSuggestion(suggestion)
                                    }
                                >
                                    <X className="size-4" aria-hidden="true" />
                                    Discard
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="Lesson Builder" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="-ml-2"
                                onClick={() => router.visit('/teacher/lessons')}
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Back to lessons
                            </Button>
                            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Lesson Builder
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                                Build the exact student flow: set up the lesson,
                                add section content with inline activities, then
                                review before publishing.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            {autosaveMessage && (
                                <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
                                    <Save
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {autosaveMessage}
                                </span>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => saveLesson(false)}
                                disabled={savingAction !== null}
                            >
                                {savingAction === 'draft'
                                    ? 'Saving...'
                                    : 'Save Draft'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => saveLesson(true)}
                                disabled={savingAction !== null}
                            >
                                {savingAction === 'publish'
                                    ? 'Publishing...'
                                    : 'Publish'}
                            </Button>
                        </div>
                    </div>

                    {formErrors.length > 0 && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            <p className="font-medium">
                                Please fix these before publishing:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                {formErrors.map((error) => (
                                    <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {teacherWorkflowPanel}

                    <Tabs
                        defaultValue="basic-info"
                        value={activeTab}
                        onValueChange={(value) => {
                            goToBuilderTab(value);
                        }}
                        className="lesson-builder-tabs min-w-0 gap-6 overflow-hidden"
                    >
                        <TabsList>
                            <TabsTrigger value="basic-info">Setup</TabsTrigger>
                            <TabsTrigger value="content-sections">
                                Build Lesson
                            </TabsTrigger>
                            <TabsTrigger value="preview">
                                Review & Publish
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic-info">
                            <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
                                <CardHeader>
                                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <CardTitle>Setup</CardTitle>
                                            <CardDescription>
                                                Start with the core lesson
                                                details students and teachers
                                                will recognize.
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={
                                                isPublished
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                                    : 'border-muted bg-muted/40 text-muted-foreground'
                                            }
                                        >
                                            {isPublished
                                                ? 'Published'
                                                : 'Draft'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(event) =>
                                                setTitle(event.target.value)
                                            }
                                            placeholder="Photosynthesis and Plant Energy"
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="subject">
                                                Subject
                                            </Label>
                                            <Input
                                                id="subject"
                                                value={subject}
                                                onChange={(event) =>
                                                    setSubject(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Science"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="topic">Topic</Label>
                                            <Input
                                                id="topic"
                                                value={topic}
                                                onChange={(event) =>
                                                    setTopic(event.target.value)
                                                }
                                                placeholder="Photosynthesis"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="difficulty">
                                            Difficulty
                                        </Label>
                                        <Select
                                            value={difficulty}
                                            onValueChange={(value) =>
                                                setDifficulty(
                                                    value as Difficulty,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="difficulty"
                                                className="w-full md:w-72"
                                            >
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">
                                                    Beginner
                                                </SelectItem>
                                                <SelectItem value="intermediate">
                                                    Intermediate
                                                </SelectItem>
                                                <SelectItem value="advanced">
                                                    Advanced
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
                                        <div>
                                            <h3 className="font-medium">
                                                Quick start
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Start from a reusable lesson
                                                pattern or generate a full
                                                editable draft from the topic.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 md:grid-cols-3">
                                            {lessonTemplates.map((template) => (
                                                <button
                                                    key={template.name}
                                                    type="button"
                                                    onClick={() =>
                                                        applyTemplate(template)
                                                    }
                                                    className="rounded-lg border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                                                >
                                                    <span className="font-medium">
                                                        {template.name}
                                                    </span>
                                                    <span className="mt-1 block text-muted-foreground">
                                                        {template.description}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid gap-4 rounded-lg border bg-background p-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="lesson-length">
                                                        Lesson length
                                                    </Label>
                                                    <Input
                                                        id="lesson-length"
                                                        value={lessonLength}
                                                        onChange={(event) =>
                                                            setLessonLength(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="20-30 minutes"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="learning-goal">
                                                        Learning goal
                                                    </Label>
                                                    <Input
                                                        id="learning-goal"
                                                        value={learningGoal}
                                                        onChange={(event) =>
                                                            setLearningGoal(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Students can explain..."
                                                    />
                                                </div>
                                            </div>
                                            {draftError && (
                                                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                                    {draftError}
                                                </p>
                                            )}
                                            <Button
                                                type="button"
                                                className="w-fit"
                                                onClick={generateLessonDraft}
                                                disabled={isGeneratingDraft}
                                            >
                                                <Wand2
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                                {isGeneratingDraft
                                                    ? 'Generating draft...'
                                                    : 'Generate Full Draft'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent
                            value="content-sections"
                            className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"
                        >
                            <div className="order-first xl:sticky xl:top-4 xl:order-none xl:col-start-2 xl:row-start-1 xl:self-start">
                                {sectionNavigatorPanel}
                            </div>

                            <div
                                ref={lessonBuilderTopRef}
                                className="xl:col-start-1 xl:row-span-2 xl:row-start-1"
                            >
                                <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
                                    <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <CardTitle>Build Lesson</CardTitle>
                                            <CardDescription>
                                                Add ordered sections, media, and
                                                the activities students answer
                                                inside each section.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => addSection()}
                                        >
                                            <Plus
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Add Section
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {sections.length === 0 ? (
                                            <EmptyBuilderState
                                                icon={BookOpen}
                                                title="No sections yet"
                                                description="Add a section or accept an AI suggestion to begin shaping the student lesson."
                                            />
                                        ) : (
                                            sortedSections.map(
                                                (section, sectionIndex) => (
                                                    <div
                                                        key={section.id}
                                                        ref={(element) => {
                                                            sectionRefs.current[
                                                                section.id
                                                            ] = element;
                                                        }}
                                                        className="scroll-mt-6"
                                                    >
                                                        <Card className="border-sidebar-border/70 shadow-none dark:border-sidebar-border">
                                                            <CardHeader className="gap-4 p-2 sm:flex sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <CardTitle className="text-base">
                                                                            Section{' '}
                                                                            {
                                                                                section.sort_order
                                                                            }
                                                                        </CardTitle>
                                                                        <Badge variant="secondary">
                                                                            {
                                                                                section
                                                                                    .activities
                                                                                    .length
                                                                            }{' '}
                                                                            activities
                                                                        </Badge>
                                                                        <Badge variant="outline">
                                                                            {
                                                                                section
                                                                                    .media
                                                                                    .length
                                                                            }{' '}
                                                                            media
                                                                        </Badge>
                                                                    </div>
                                                                    <CardDescription>
                                                                        Edit
                                                                        title,
                                                                        content,
                                                                        order,
                                                                        and
                                                                        section
                                                                        activities.
                                                                    </CardDescription>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={
                                                                            sectionIndex ===
                                                                            0
                                                                        }
                                                                        onClick={() =>
                                                                            moveSection(
                                                                                section.id,
                                                                                -1,
                                                                            )
                                                                        }
                                                                    >
                                                                        <ArrowUp
                                                                            className="size-4"
                                                                            aria-hidden="true"
                                                                        />
                                                                        Up
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled={
                                                                            sectionIndex ===
                                                                            sortedSections.length -
                                                                                1
                                                                        }
                                                                        onClick={() =>
                                                                            moveSection(
                                                                                section.id,
                                                                                1,
                                                                            )
                                                                        }
                                                                    >
                                                                        <ArrowDown
                                                                            className="size-4"
                                                                            aria-hidden="true"
                                                                        />
                                                                        Down
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            removeSection(
                                                                                section.id,
                                                                            )
                                                                        }
                                                                        aria-label="Remove section"
                                                                        severity="danger"
                                                                        className="shrink-0"
                                                                        icon={
                                                                            <Trash2
                                                                                className="size-4"
                                                                                aria-hidden="true"
                                                                            />
                                                                        }
                                                                        label="Remove"
                                                                    />
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="grid gap-4 p-4">
                                                                <div className="grid gap-2">
                                                                    <Label
                                                                        htmlFor={`${section.id}-title`}
                                                                    >
                                                                        Section
                                                                        title
                                                                    </Label>
                                                                    <Input
                                                                        id={`${section.id}-title`}
                                                                        value={
                                                                            section.title
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            updateSection(
                                                                                section.id,
                                                                                {
                                                                                    title: event
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="grid gap-4">
                                                                    <div className="grid gap-2 md:max-w-xs">
                                                                        <Label>
                                                                            Content
                                                                            format
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                section.content_type
                                                                            }
                                                                            onValueChange={(
                                                                                value,
                                                                            ) => {
                                                                                const contentType =
                                                                                    value as LessonSection['content_type'];

                                                                                updateSection(
                                                                                    section.id,
                                                                                    {
                                                                                        content_type:
                                                                                            contentType,
                                                                                        content:
                                                                                            contentType ===
                                                                                            'slides'
                                                                                                ? ensureSlideDeck(
                                                                                                      section.content,
                                                                                                  )
                                                                                                : hasSlideDeck(
                                                                                                        section.content,
                                                                                                    )
                                                                                                  ? ''
                                                                                                  : section.content,
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="w-full">
                                                                                <SelectValue placeholder="Select format" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="text">
                                                                                    Text
                                                                                </SelectItem>
                                                                                <SelectItem value="slides">
                                                                                    Slides
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    {section.content_type ===
                                                                    'slides' ? (
                                                                        <div className="grid gap-3">
                                                                            <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                                                <div className="flex items-start gap-3">
                                                                                    <Presentation
                                                                                        className="mt-0.5 size-5 text-muted-foreground"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                    <div>
                                                                                        <p className="text-sm font-medium">
                                                                                            Build
                                                                                            slides
                                                                                        </p>
                                                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                                                            Create
                                                                                            a
                                                                                            simple
                                                                                            section
                                                                                            deck
                                                                                            or
                                                                                            upload
                                                                                            slides
                                                                                            below.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        addSectionMedia(
                                                                                            section.id,
                                                                                            {
                                                                                                type: 'slides',
                                                                                                source: 'upload',
                                                                                                caption:
                                                                                                    section.title ||
                                                                                                    'Section slides',
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Upload
                                                                                        className="size-4"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                    Upload
                                                                                    Slides
                                                                                </Button>
                                                                            </div>
                                                                            <SlideDeckEditor
                                                                                id={`${section.id}-slides`}
                                                                                value={
                                                                                    section.content
                                                                                }
                                                                                onChange={(
                                                                                    content,
                                                                                ) =>
                                                                                    updateSection(
                                                                                        section.id,
                                                                                        {
                                                                                            content,
                                                                                        },
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid gap-2">
                                                                            <Label
                                                                                htmlFor={`${section.id}-content`}
                                                                            >
                                                                                Section
                                                                                content
                                                                            </Label>
                                                                            <RichTextEditor
                                                                                id={`${section.id}-content`}
                                                                                value={
                                                                                    section.content
                                                                                }
                                                                                onChange={(
                                                                                    content,
                                                                                ) =>
                                                                                    updateSection(
                                                                                        section.id,
                                                                                        {
                                                                                            content:
                                                                                                content,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    height: '12rem',
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 rounded-lg border p-3">
                                                                    <Checkbox
                                                                        id={`${section.id}-collapsible`}
                                                                        checked={
                                                                            section.is_collapsible
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            updateSection(
                                                                                section.id,
                                                                                {
                                                                                    is_collapsible:
                                                                                        checked ===
                                                                                        true,
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`${section.id}-collapsible`}
                                                                    >
                                                                        Collapsible
                                                                        for
                                                                        students
                                                                    </Label>
                                                                </div>
                                                                <Separator />
                                                                <SectionMediaEditor
                                                                    section={
                                                                        section
                                                                    }
                                                                    onAddMedia={() =>
                                                                        addSectionMedia(
                                                                            section.id,
                                                                        )
                                                                    }
                                                                    onUpdateMedia={(
                                                                        mediaId,
                                                                        patch,
                                                                    ) =>
                                                                        updateSectionMedia(
                                                                            section.id,
                                                                            mediaId,
                                                                            patch,
                                                                        )
                                                                    }
                                                                    onRemoveMedia={(
                                                                        mediaId,
                                                                    ) =>
                                                                        removeSectionMedia(
                                                                            section.id,
                                                                            mediaId,
                                                                        )
                                                                    }
                                                                    onFileRejected={(
                                                                        message,
                                                                    ) =>
                                                                        setFormErrors(
                                                                            [
                                                                                message,
                                                                            ],
                                                                        )
                                                                    }
                                                                />
                                                                <Separator />
                                                                <div className="grid gap-4">
                                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                        <div>
                                                                            <h3 className="text-sm font-medium">
                                                                                Reinforce
                                                                                this
                                                                                section
                                                                                with
                                                                                an
                                                                                activity
                                                                            </h3>
                                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                                Students
                                                                                will
                                                                                see
                                                                                this
                                                                                activity
                                                                                after
                                                                                reading
                                                                                this
                                                                                section.
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <Button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    generateSectionActivity(
                                                                                        section,
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    generatingSectionActivityId ===
                                                                                    section.id
                                                                                }
                                                                            >
                                                                                <Sparkles
                                                                                    className="size-4"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                {generatingSectionActivityId ===
                                                                                section.id
                                                                                    ? 'Generating...'
                                                                                    : 'AI Activity'}
                                                                            </Button>
                                                                            <Select
                                                                                onValueChange={(
                                                                                    value,
                                                                                ) =>
                                                                                    addSectionActivity(
                                                                                        section.id,
                                                                                        value as ActivityType,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="w-full sm:w-52">
                                                                                    <SelectValue placeholder="Add Mini Quiz or choose type" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="mini_quiz">
                                                                                        Mini
                                                                                        Quiz
                                                                                        (default)
                                                                                    </SelectItem>
                                                                                    <SelectItem value="true_false">
                                                                                        True
                                                                                        or
                                                                                        False
                                                                                    </SelectItem>
                                                                                    <SelectItem value="fill_blank">
                                                                                        Fill
                                                                                        in
                                                                                        the
                                                                                        Blank
                                                                                    </SelectItem>
                                                                                    <SelectItem value="matching">
                                                                                        Matching
                                                                                    </SelectItem>
                                                                                    <SelectItem value="sequencing">
                                                                                        Sequencing
                                                                                    </SelectItem>
                                                                                    <SelectItem value="reflection">
                                                                                        Reflection
                                                                                        Question
                                                                                    </SelectItem>
                                                                                    <SelectItem value="clickable_activity">
                                                                                        Clickable
                                                                                        Cards
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    {section
                                                                        .activities
                                                                        .length ===
                                                                    0 ? (
                                                                        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                                                            No
                                                                            activities
                                                                            attached
                                                                            to
                                                                            this
                                                                            section
                                                                            yet.
                                                                        </p>
                                                                    ) : (
                                                                        <Accordion
                                                                            type="multiple"
                                                                            className="w-full"
                                                                        >
                                                                            {section.activities.map(
                                                                                (
                                                                                    activity,
                                                                                    index,
                                                                                ) => (
                                                                                    <AccordionItem
                                                                                        key={
                                                                                            activity.id
                                                                                        }
                                                                                        value={
                                                                                            activity.id
                                                                                        }
                                                                                    >
                                                                                        <AccordionTrigger>
                                                                                            <span className="flex flex-wrap items-center gap-2 text-left">
                                                                                                <span>
                                                                                                    {activity.title ||
                                                                                                        `Activity ${index + 1}`}
                                                                                                </span>
                                                                                                <Badge variant="outline">
                                                                                                    {
                                                                                                        activityLabels[
                                                                                                            activity
                                                                                                                .type
                                                                                                        ]
                                                                                                    }
                                                                                                </Badge>
                                                                                            </span>
                                                                                        </AccordionTrigger>
                                                                                        <AccordionContent>
                                                                                            <ActivityEditor
                                                                                                activity={
                                                                                                    activity
                                                                                                }
                                                                                                index={
                                                                                                    index
                                                                                                }
                                                                                                onChange={(
                                                                                                    patch,
                                                                                                ) =>
                                                                                                    updateSectionActivity(
                                                                                                        section.id,
                                                                                                        activity.id,
                                                                                                        patch,
                                                                                                    )
                                                                                                }
                                                                                                onChoiceChange={(
                                                                                                    choiceIndex,
                                                                                                    value,
                                                                                                ) =>
                                                                                                    updateSectionActivityChoice(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        choiceIndex,
                                                                                                        value,
                                                                                                    )
                                                                                                }
                                                                                                onPairChange={(
                                                                                                    pairIndex,
                                                                                                    field,
                                                                                                    value,
                                                                                                ) =>
                                                                                                    updateSectionActivityPair(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        pairIndex,
                                                                                                        field,
                                                                                                        value,
                                                                                                    )
                                                                                                }
                                                                                                onAddPair={() =>
                                                                                                    addSectionActivityPair(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                    )
                                                                                                }
                                                                                                onRemovePair={(
                                                                                                    pairIndex,
                                                                                                ) =>
                                                                                                    removeSectionActivityPair(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        pairIndex,
                                                                                                    )
                                                                                                }
                                                                                                onItemChange={(
                                                                                                    itemIndex,
                                                                                                    value,
                                                                                                ) =>
                                                                                                    updateSectionActivityItem(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        itemIndex,
                                                                                                        value,
                                                                                                    )
                                                                                                }
                                                                                                onAddItem={() =>
                                                                                                    addSectionActivityItem(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                    )
                                                                                                }
                                                                                                onRemoveItem={(
                                                                                                    itemIndex,
                                                                                                ) =>
                                                                                                    removeSectionActivityItem(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        itemIndex,
                                                                                                    )
                                                                                                }
                                                                                                onCardChange={(
                                                                                                    cardIndex,
                                                                                                    patch,
                                                                                                ) =>
                                                                                                    updateSectionActivityCard(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        cardIndex,
                                                                                                        patch,
                                                                                                    )
                                                                                                }
                                                                                                onAddCard={() =>
                                                                                                    addSectionActivityCard(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                    )
                                                                                                }
                                                                                                onRemoveCard={(
                                                                                                    cardIndex,
                                                                                                ) =>
                                                                                                    removeSectionActivityCard(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                        cardIndex,
                                                                                                    )
                                                                                                }
                                                                                                onDuplicate={() =>
                                                                                                    duplicateSectionActivity(
                                                                                                        section.id,
                                                                                                        activity,
                                                                                                    )
                                                                                                }
                                                                                                onRemove={() =>
                                                                                                    removeSectionActivity(
                                                                                                        section.id,
                                                                                                        activity.id,
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </AccordionContent>
                                                                                    </AccordionItem>
                                                                                ),
                                                                            )}
                                                                        </Accordion>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                ),
                                            )
                                        )}
                                        {sections.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => addSection()}
                                            >
                                                <Plus
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                                Add Section
                                            </Button>
                                        )}
                                        <div ref={sectionsEndRef} />
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-sidebar-border/70 p-4 shadow-sm sm:p-6 xl:col-start-2 xl:row-start-2 dark:border-sidebar-border">
                                <CardHeader>
                                    <CardTitle>Section Preview</CardTitle>
                                    <CardDescription>
                                        Preview the section-first flow students
                                        will follow.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {sortedSections.length === 0 ? (
                                        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                            Sections will appear here after you
                                            add them.
                                        </p>
                                    ) : (
                                        <SectionAccordion
                                            sections={sortedSections}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <div className="xl:col-span-2">
                                {endOfLessonActivitiesPanel}
                            </div>

                            <div className="xl:col-span-2">
                                {aiSuggestionsPanel}
                            </div>
                        </TabsContent>

                        <TabsContent value="preview">
                            <StudentLessonPreview
                                title={title}
                                subject={subject}
                                topic={topic}
                                difficulty={difficulty}
                                sections={sortedSections}
                                activities={activities}
                            />
                        </TabsContent>
                    </Tabs>

                    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                Ready to save?
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Draft and publish actions save this lesson to
                                the teacher workspace.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => saveLesson(false)}
                                disabled={savingAction !== null}
                            >
                                {savingAction === 'draft'
                                    ? 'Saving...'
                                    : 'Save Draft'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => saveLesson(true)}
                                disabled={savingAction !== null}
                            >
                                {savingAction === 'publish'
                                    ? 'Publishing...'
                                    : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={Boolean(pendingLeaveVisit)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeUnsavedChangesDialog();
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Unsaved Changes</DialogTitle>
                        <DialogDescription>
                            Leaving now will discard your latest lesson edits.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeUnsavedChangesDialog}
                        >
                            Stay
                        </Button>
                        <Button type="button" onClick={leaveWithUnsavedChanges}>
                            Leave
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(viewingSuggestion)}
                onOpenChange={(open) => {
                    if (!open) {
                        setViewingSuggestion(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>View AI Suggestion</DialogTitle>
                        <DialogDescription>
                            Review the full suggestion details before deciding
                            to accept, edit, or discard.
                        </DialogDescription>
                    </DialogHeader>

                    {viewingSuggestion && (
                        <SuggestionPreview suggestion={viewingSuggestion} />
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setViewingSuggestion(null)}
                        >
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (viewingSuggestion) {
                                    openSuggestionEditor(viewingSuggestion);
                                    setViewingSuggestion(null);
                                }
                            }}
                        >
                            <Pencil className="size-4" aria-hidden="true" />
                            Edit
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (viewingSuggestion) {
                                    acceptSuggestion(viewingSuggestion);
                                    setViewingSuggestion(null);
                                }
                            }}
                        >
                            <Check className="size-4" aria-hidden="true" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(editingSuggestion)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSuggestionEditor();
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit AI Suggestion</DialogTitle>
                        <DialogDescription>
                            Modify the suggestion, then accept it into the
                            lesson builder.
                        </DialogDescription>
                    </DialogHeader>

                    {editedSuggestion && (
                        <div className="grid gap-4">
                            <Badge variant="secondary" className="w-fit">
                                {suggestionLabels[editedSuggestion.type]}
                            </Badge>
                            {editedSuggestion.type === 'section_activity' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="suggestion-section">
                                        Section
                                    </Label>
                                    <Input
                                        id="suggestion-section"
                                        value={
                                            editedSuggestion.payload
                                                ?.section_title ?? ''
                                        }
                                        onChange={(event) =>
                                            setEditedSuggestion({
                                                ...editedSuggestion,
                                                payload: {
                                                    ...editedSuggestion.payload,
                                                    section_title:
                                                        event.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="suggestion-title">Title</Label>
                                <Input
                                    id="suggestion-title"
                                    value={editedSuggestion.title}
                                    onChange={(event) =>
                                        setEditedSuggestion({
                                            ...editedSuggestion,
                                            title: event.target.value,
                                            payload: {
                                                ...editedSuggestion.payload,
                                                title: event.target.value,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="suggestion-content">
                                    Content
                                </Label>
                                <Textarea
                                    id="suggestion-content"
                                    value={editedSuggestion.content}
                                    onChange={(event) =>
                                        setEditedSuggestion({
                                            ...editedSuggestion,
                                            content: event.target.value,
                                            payload: {
                                                ...editedSuggestion.payload,
                                                content:
                                                    editedSuggestion.type ===
                                                        'lesson_section' ||
                                                    editedSuggestion.type ===
                                                        'expanded_explanation' ||
                                                    editedSuggestion.type ===
                                                        'summary'
                                                        ? event.target.value
                                                        : editedSuggestion
                                                              .payload?.content,
                                                question:
                                                    editedSuggestion.type ===
                                                    'mini_quiz'
                                                        ? event.target.value
                                                        : editedSuggestion
                                                              .payload
                                                              ?.question,
                                                instruction: [
                                                    'true_false',
                                                    'fill_blank',
                                                    'matching',
                                                    'sequencing',
                                                    'reflection',
                                                    'clickable_activity',
                                                ].includes(
                                                    editedSuggestion.type,
                                                )
                                                    ? event.target.value
                                                    : editedSuggestion.payload
                                                          ?.instruction,
                                                caption:
                                                    editedSuggestion.type ===
                                                    'media_suggestion'
                                                        ? event.target.value
                                                        : editedSuggestion
                                                              .payload?.caption,
                                            },
                                        })
                                    }
                                    className="min-h-36"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeSuggestionEditor}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={acceptEditedSuggestion}>
                            <Check className="size-4" aria-hidden="true" />
                            Accept Edited Suggestion
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CreateTeacherLesson.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: teacherDashboard(),
        },
        {
            title: 'Lessons',
            href: teacherLessons(),
        },
        {
            title: 'Create',
            href: '/teacher/lessons/create',
        },
    ],
};
