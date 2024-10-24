import React from "react";
import {format, isToday, isYesterday} from "date-fns";
import {fr} from "date-fns/locale";
import {cn} from "@/lib/utils";
import {CheckCheck} from "lucide-react";

type Props = {
    fromCurrentUser: boolean;
    lastByUser: boolean;
    lastByMessages: boolean;
    content: string;
    sent_at: string;
    isRead?: boolean;
};

const Message = ({fromCurrentUser, lastByUser, lastByMessages, content, sent_at, isRead}: Props) => {

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        if (isToday(date)) {
            return format(date, "HH:mm");
        } else if (isYesterday(date)) {
            return `Hier à ${format(date, "HH:mm")}`;
        } else {
            return format(date, "d MMMM 'à' HH:mm", {locale: fr});
        }
    };

    return (
        <div className={cn("flex items-end mb-4", {
            'justify-end': fromCurrentUser,
            'justify-start': !fromCurrentUser
        })}>
            <div className={cn("flex w-full mx-2", {
                "order-1 justify-end": fromCurrentUser,
                "order-2 justify-start": !fromCurrentUser
            })}>
                <div className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
                    "bg-primary text-primary-foreground": fromCurrentUser,
                    "bg-secondary text-secondary-foreground": !fromCurrentUser,
                    "rounded-br-none": lastByUser && fromCurrentUser,
                    "rounded-bl-none": lastByUser && !fromCurrentUser
                })}>
                    <p className="text-wrap break-words whitespace-pre-wrap">
                        {content}
                    </p>

                </div>

                <span className={cn("text-xs ml-4 mr-4", {
                    "text-gray-500": fromCurrentUser,
                    "text-gray-400": !fromCurrentUser,
                    "order-last": !fromCurrentUser,
                    "order-first": fromCurrentUser
                })}>
                    {formatTime(sent_at)}
                </span>
                {fromCurrentUser && lastByUser && lastByMessages && isRead && (
                    <span className="text-xs text-gray-400 mt-1 flex items-center justify-end">
                        Vu <CheckCheck className="h-4 w-4 ml-1"/>
                    </span>
                )}
            </div>
        </div>
    );
};

export default Message;