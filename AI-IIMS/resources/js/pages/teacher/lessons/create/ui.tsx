import type { ComponentProps, ElementType, ReactNode } from 'react';
import { createElement, isValidElement } from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button as ShadButton } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const joinClasses = (
    ...classes: Array<string | false | null | undefined>
) => cn(...classes);

type ButtonProps = Omit<
    ComponentProps<typeof ShadButton>,
    'children' | 'size' | 'variant'
> & {
    children?: ReactNode;
    icon?: ElementType | ReactNode;
    label?: ReactNode;
    severity?: 'danger' | string;
    size?: ComponentProps<typeof ShadButton>['size'];
    variant?: ComponentProps<typeof ShadButton>['variant'];
};

export function Button({
    children,
    className,
    icon,
    label,
    severity,
    variant,
    ...props
}: ButtonProps) {
    const iconNode =
        icon && isValidElement(icon)
            ? icon
            : icon
              ? createElement(icon as ElementType, {
                    'aria-hidden': true,
                    className: 'size-4',
                })
              : null;

    return (
        <ShadButton
            className={className}
            variant={severity === 'danger' ? 'destructive' : variant}
            {...props}
        >
            {iconNode}
            {children ?? label}
        </ShadButton>
    );
}

export {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
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
};
