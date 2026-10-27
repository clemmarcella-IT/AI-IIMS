import { Button as PrimeButton } from 'primereact/button';

import type { Panel, TeacherPanel } from './types';

type TeacherPanelNavProps = {
    activePanel: Panel;
    panels: TeacherPanel[];
    onPanelChange: (panel: Panel) => void;
};

export function TeacherPanelNav({
    activePanel,
    panels,
    onPanelChange,
}: TeacherPanelNavProps) {
    return (
        <aside className="grid min-w-0 gap-2 sm:grid-cols-2 xl:block xl:space-y-2">
            {panels.map((panel) => {
                const Icon = panel.icon;
                const isActive = activePanel === panel.id;

                return (
                    <PrimeButton
                        key={panel.id}
                        type="button"
                        text
                        onClick={() => onPanelChange(panel.id)}
                        className={`flex min-h-20 w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                            isActive
                                ? 'border-primary bg-primary/5'
                                : 'border-sidebar-border/70 bg-card hover:border-foreground/20 dark:border-sidebar-border'
                        }`}
                    >
                        <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block font-medium">
                                {panel.title}
                            </span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                                {panel.description}
                            </span>
                        </span>
                    </PrimeButton>
                );
            })}
        </aside>
    );
}
