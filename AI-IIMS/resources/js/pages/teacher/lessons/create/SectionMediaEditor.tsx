import { Plus, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';

import { CueTimeline } from './CueTimeline';
import {
    inferMediaTypeFromFile,
    maxMediaUploadBytes,
    maxMediaUploadLabel,
} from './helpers';
import type { LessonMedia, LessonSection } from './types';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from './ui';

export function SectionMediaEditor({
    section,
    onAddMedia,
    onUpdateMedia,
    onRemoveMedia,
    onFileRejected,
}: {
    section: LessonSection;
    onAddMedia: () => void;
    onUpdateMedia: (
        mediaId: string,
        patch: Partial<Omit<LessonMedia, 'id'>>,
    ) => void;
    onRemoveMedia: (mediaId: string) => void;
    onFileRejected: (message: string) => void;
}) {
    const handleFileChange = (
        mediaId: string,
        currentType: LessonMedia['type'],
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            onUpdateMedia(mediaId, {
                file: null,
                preview_url: undefined,
                upload_name: undefined,
            });

            return;
        }

        if (file.size > maxMediaUploadBytes) {
            event.target.value = '';
            onFileRejected(
                `Media uploads must be ${maxMediaUploadLabel} or smaller. Choose a smaller file or use a URL instead.`,
            );

            return;
        }

        const inferredType = inferMediaTypeFromFile(file);

        onUpdateMedia(mediaId, {
            type:
                currentType === 'slides'
                    ? 'slides'
                    : inferredType === 'slides'
                      ? currentType
                      : inferredType,
            source: 'upload',
            file,
            url: '',
            preview_url: URL.createObjectURL(file),
            upload_name: file.name,
        });
    };

    return (
        <div className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-sm font-medium">Section Media</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Attach images, videos, or links that belong with this
                        specific section. Uploads must be {maxMediaUploadLabel}{' '}
                        or smaller.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddMedia}
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add Media
                </Button>
            </div>

            {section.media.length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    No media attached to this section yet.
                </p>
            ) : (
                <div className="grid gap-4">
                    {section.media.map((mediaItem) => (
                        <Card
                            key={mediaItem.id}
                            className="border-sidebar-border/70 p-4 shadow-none dark:border-sidebar-border"
                        >
                            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle className="text-base">
                                        Media Resource
                                    </CardTitle>
                                    <CardDescription>
                                        Choose a type, source, and caption.
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onRemoveMedia(mediaItem.id)}
                                    aria-label="Remove media"
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
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-[180px_180px_1fr]">
                                    <div className="grid gap-2">
                                        <Label>Type</Label>
                                        {mediaItem.type === 'slides' ? (
                                            <Input value="Slides" disabled />
                                        ) : (
                                            <Select
                                                value={mediaItem.type}
                                                onValueChange={(value) =>
                                                    onUpdateMedia(
                                                        mediaItem.id,
                                                        {
                                                            type: value as LessonMedia['type'],
                                                        },
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="image">
                                                        Image
                                                    </SelectItem>
                                                    <SelectItem value="video">
                                                        Video
                                                    </SelectItem>
                                                    <SelectItem value="link">
                                                        Link
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Source</Label>
                                        <Select
                                            value={mediaItem.source}
                                            onValueChange={(value) =>
                                                onUpdateMedia(mediaItem.id, {
                                                    source: value as LessonMedia['source'],
                                                    file:
                                                        value === 'url'
                                                            ? null
                                                            : mediaItem.file,
                                                    preview_url:
                                                        value === 'url'
                                                            ? undefined
                                                            : mediaItem.preview_url,
                                                    upload_name:
                                                        value === 'url'
                                                            ? undefined
                                                            : mediaItem.upload_name,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="url">
                                                    URL
                                                </SelectItem>
                                                <SelectItem value="upload">
                                                    Upload
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        {mediaItem.source === 'upload' ? (
                                            <>
                                                <Label
                                                    htmlFor={`${mediaItem.id}-file`}
                                                >
                                                    Upload
                                                </Label>
                                                <label
                                                    htmlFor={`${mediaItem.id}-file`}
                                                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                                                >
                                                    <Upload
                                                        className="size-4 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="truncate">
                                                        {mediaItem.upload_name ??
                                                            (mediaItem.type ===
                                                            'slides'
                                                                ? 'Choose slides file'
                                                                : 'Choose image, video, or file')}
                                                    </span>
                                                </label>
                                                <input
                                                    id={`${mediaItem.id}-file`}
                                                    type="file"
                                                    className="sr-only"
                                                    accept={
                                                        mediaItem.type ===
                                                        'slides'
                                                            ? '.pdf,.ppt,.pptx'
                                                            : 'image/*,video/*,.doc,.docx'
                                                    }
                                                    onChange={(event) =>
                                                        handleFileChange(
                                                            mediaItem.id,
                                                            mediaItem.type,
                                                            event,
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Label
                                                    htmlFor={`${mediaItem.id}-url`}
                                                >
                                                    URL
                                                </Label>
                                                <Input
                                                    id={`${mediaItem.id}-url`}
                                                    value={mediaItem.url}
                                                    onChange={(event) =>
                                                        onUpdateMedia(
                                                            mediaItem.id,
                                                            {
                                                                url: event
                                                                    .target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`${mediaItem.id}-caption`}>
                                        Caption
                                    </Label>
                                    <Textarea
                                        id={`${mediaItem.id}-caption`}
                                        value={mediaItem.caption}
                                        onChange={(event) =>
                                            onUpdateMedia(mediaItem.id, {
                                                caption: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {mediaItem.type === 'video' && (
                                    <CueTimeline
                                        cuePoints={mediaItem.cue_points ?? []}
                                        mediaUrl={
                                            mediaItem.preview_url ??
                                            mediaItem.url
                                        }
                                        onChange={(cuePoints) =>
                                            onUpdateMedia(mediaItem.id, {
                                                cue_points: cuePoints,
                                            })
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
