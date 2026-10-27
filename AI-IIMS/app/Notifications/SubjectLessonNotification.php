<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class SubjectLessonNotification extends Notification
{
    public function __construct(
        private readonly string $eventType,
        private readonly int $lessonId,
        private readonly string $lessonTitle,
        private readonly ?string $subject,
        private readonly int $activityCount = 0,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'event_type' => $this->eventType,
            'lesson_id' => $this->lessonId,
            'lesson_title' => $this->lessonTitle,
            'subject' => $this->subject ?: 'General',
            'activity_count' => $this->activityCount,
        ];
    }
}
