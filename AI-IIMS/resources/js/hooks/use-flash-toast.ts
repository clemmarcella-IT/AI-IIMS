import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashData = {
    toast?: FlashToast;
    success?: string;
    info?: string;
    warning?: string;
    error?: string;
};

function normalizeFlashToast(flash: FlashData): FlashToast | null {
    if (flash.toast) {
        return flash.toast;
    }

    const type = (['success', 'error', 'warning', 'info'] as const).find(
        (key) => typeof flash[key] === 'string',
    );

    if (!type) {
        return null;
    }

    const message = flash[type];

    return typeof message === 'string' ? { type, message } : null;
}

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as
                | FlashData
                | undefined;
            const data = flash ? normalizeFlashToast(flash) : null;

            if (!data) {
                return;
            }

            toast[data.type](data.message, { duration: 4000 });
        });
    }, []);
}
