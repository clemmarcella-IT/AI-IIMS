import { Toaster } from '@/components/ui/sonner';
import { useFlashToast } from '@/hooks/use-flash-toast';

export function FlashToaster() {
    useFlashToast();

    return <Toaster position="top-right" richColors />;
}
