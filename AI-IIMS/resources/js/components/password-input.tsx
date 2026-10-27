import { Password } from 'primereact/password';
import type { ComponentProps, Ref } from 'react';
import { cn } from '@/lib/utils';

type Props = Omit<ComponentProps<'input'>, 'type' | 'value' | 'ref'> & {
    value?: string;
    ref?: Ref<HTMLInputElement>;
};

export default function PasswordInput({ className, ref, id, ...props }: Props) {
    return (
        <Password
            inputId={id}
            inputRef={ref}
            toggleMask
            feedback={false}
            className={cn(
                '!flex !w-full',
                '[&>div]:!w-full [&>span]:!w-full',
                '[&_input]:!w-full',
                className,
            )}
            {...props}
        />
    );
}
