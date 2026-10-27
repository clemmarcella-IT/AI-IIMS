import type { ActivityComponentProps } from './activity-utils';
import { ClickableCardsActivity } from './ClickableCardsActivity';
import { FillBlankActivity } from './FillBlankActivity';
import { MatchingActivity } from './MatchingActivity';
import { MiniQuizActivity } from './MiniQuizActivity';
import { ReflectionActivity } from './ReflectionActivity';
import { SequencingActivity } from './SequencingActivity';
import { TrueFalseActivity } from './TrueFalseActivity';

export function ActivityRenderer(props: ActivityComponentProps) {
    const { activity } = props;

    if (activity.type === 'mini_quiz') {
        return <MiniQuizActivity {...props} />;
    }

    if (activity.type === 'true_false') {
        return <TrueFalseActivity {...props} />;
    }

    if (activity.type === 'fill_blank') {
        return <FillBlankActivity {...props} />;
    }

    if (activity.type === 'matching') {
        return <MatchingActivity {...props} />;
    }

    if (activity.type === 'sequencing') {
        return <SequencingActivity {...props} />;
    }

    if (activity.type === 'clickable_activity') {
        return <ClickableCardsActivity {...props} />;
    }

    return <ReflectionActivity {...props} />;
}
