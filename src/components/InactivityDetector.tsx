"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BookOpenText } from "lucide-react";

type Props = {
    timeout?: number;
};

export default function InactivityDetector({ timeout = 5 * 60 * 1000 }: Props) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            toast({
                title: "Toujours là ? 👀",
                description: (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10">
                            <BookOpenText className="text-purple-300 w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <div className="text-sm leading-snug">
                                Vous êtes resté inactif un moment. Et si vous tourniez une nouvelle page ?
                            </div>
                        </div>
                    </div>
                ),
                duration: 8000,
                className: "bg-gradient-to-br from-tertiary-black to-secondary-black text-text-white rounded-xl shadow-lg px-6 py-4",
            });
        }, timeout);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach((event) => window.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname, timeout]);

    return null;
}