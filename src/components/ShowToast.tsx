import { toast } from "@/components/ui/use-toast";

type ToastVariant = "default" | "destructive";

export const ShowToast = (variant: ToastVariant, description: string, title?: string) => {
    toast({
        variant,
        title,
        description,
    });
};