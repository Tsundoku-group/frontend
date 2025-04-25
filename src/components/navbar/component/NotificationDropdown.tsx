"use client";

import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileContext } from "@/context/profileContext";
import { useSocket } from "@/context/socketContext";
import {
    startOfToday,
    differenceInDays,
    subDays,
    isSameDay
} from "date-fns";
import { useMemo, useState } from "react";
import { markAsReadNotifications } from "@/server-actions/navbar/actions";

export default function NotificationDropdown() {
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const { notifications, setNotifications } = useSocket();
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

    const handleMarkAsRead = async () => {
        if (!profileId) return;
        setLoading(true);

        try {
            const response = await markAsReadNotifications(profileId);
            if (response.code === 200) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } finally {
            setLoading(false);
        }
    };

    const getNotificationMessage = (notification: any) => {
        const { actorFirstName, actorCount = 1, notificationType, resourceType } = notification;
        const type = resourceType.toLowerCase();

        if (notificationType === "like") {
            return actorCount > 1
                ? `${actorFirstName} et ${actorCount - 1} autres ont liké votre ${type}`
                : `${actorFirstName} a liké votre ${type}`;
        }

        if (notificationType === "comment") {
            return actorCount > 1
                ? `${actorFirstName} et ${actorCount - 1} autres ont commenté votre ${type}`
                : `${actorFirstName} a commenté votre ${type}`;
        }

        if (notificationType === "follow") {
            return actorCount > 1
                ? `${actorFirstName} et ${actorCount - 1} autres vous suivent`
                : `${actorFirstName} vous suit`;
        }

        return "Nouvelle notification";
    };

    const groupNotifications = useMemo(() => {
        const today = startOfToday();
        const grouped: Record<string, typeof notifications> = {};

        notifications.forEach(notification => {
            const notifDate = new Date(notification.createdAt);
            let key = "Voir plus";

            if (isSameDay(notifDate, today)) key = "Aujourd'hui";
            else if (isSameDay(notifDate, subDays(today, 1))) key = "Hier";
            else {
                const daysAgo = differenceInDays(today, notifDate);
                if (daysAgo <= 7) key = `Il y a ${daysAgo} jours`;
            }

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(notification);
        });

        return grouped;
    }, [notifications]);

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) void handleMarkAsRead();
        }}>
            <DropdownMenuTrigger>
                <div className="relative cursor-pointer">
                    <Bell className="text-text-white w-6 h-6"/>
                    {hasUnread && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-highlight rounded-full"/>
                    )}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-80 bg-tertiary-black border border-gray-700 mt-2 rounded-xl p-4 shadow-xl space-y-4"
                align="end"
            >
                <div className="text-lg font-semibold text-white">Notifications</div>

                {loading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-full bg-gray-600 rounded-md" />
                        <Skeleton className="h-6 w-full bg-gray-600 rounded-md" />
                        <Skeleton className="h-6 w-full bg-gray-600 rounded-md" />
                    </div>
                ) : notifications.length > 0 ? (
                    Object.entries(groupNotifications).map(([date, notifs]) => (
                        <div key={date} className="space-y-1">
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{date}</div>
                            <div className="space-y-1.5">
                                {notifs.map((notif, idx) => (
                                    <div
                                        key={notif.id || `notif-${idx}`}
                                        className={`flex items-start gap-2 p-3 rounded-md transition ${
                                            notif.isRead
                                                ? "bg-gray-800 text-gray-400"
                                                : "bg-secondary-black text-white border-purple-highlight"
                                        } hover:bg-primary-black cursor-pointer`}
                                    >
                                        <div className="text-sm">{getNotificationMessage(notif)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm text-center py-4">Aucune notification</p>
                )}

                {groupNotifications["Voir plus"] && !showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-sm text-blue-400 hover:underline w-full text-center block"
                    >
                        Voir plus
                    </button>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}