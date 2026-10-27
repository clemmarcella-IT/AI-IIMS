import { SelectButton } from 'primereact/selectbutton';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const options: { value: Appearance; icon: string; label: string }[] = [
        { value: 'light', icon: 'pi pi-sun', label: 'Light' },
        { value: 'dark', icon: 'pi pi-moon', label: 'Dark' },
        { value: 'system', icon: 'pi pi-desktop', label: 'System' },
    ];

    return (
        <div className={cn('inline-flex', className)} {...props}>
            <SelectButton
                value={appearance}
                onChange={(e) => {
                    if (e.value) {
                        updateAppearance(e.value as Appearance);
                    }
                }}
                options={options}
                optionLabel="label"
                optionValue="value"
                itemTemplate={(option) => (
                    <span className="flex items-center gap-1.5 text-sm">
                        <i className={option.icon} />
                        {option.label}
                    </span>
                )}
                allowEmpty={false}
            />
        </div>
    );
}
