"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNotifications, markAsReadNotifications } from "@/components/navbar/actions";
import { useProfileContext } from "@/context/profileContext";
import { useSocket } from "@/context/socketContext";
import { startOfToday, differenceInDays, subDays, isSameDay } from "date-fns";

interface Notification {
    id: string;
    actorId: string;
    actorFirstName: string;
    actorLastName: string;
    notificationType: "like" | "comment" | "follow";
    resourceType: "POST" | "COMMENT" | "FOLLOW";
    resourceId: string;
    createdAt: string;
    isRead: boolean;
    actorCount: number;
}

export default function NotificationDropdown() {
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasUnread, setHasUnread] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const { socket } = useSocket();

    useEffect(() => {
        if (!profileId) return;

        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications(profileId);
                if (Array.isArray(data)) {
                    const uniqueNotifications = Array.from(new Map(data.map(n => [n.id, n])).values());
                    setNotifications(uniqueNotifications);
                    setHasUnread(uniqueNotifications.some(n => !n.isRead));
                } else {
                    setNotifications([]);
                    setHasUnread(false);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des notifications", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [profileId]);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification: Notification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            setHasUnread(true);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [socket]);

    const handleMarkAsRead = async () => {
        if (!profileId) return;
        setLoading(true);

        try {
            const response = await markAsReadNotifications(profileId);

            if (response.status === 200) {
                setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
                setHasUnread(false);
            }
        } catch (error) {
            console.error("Erreur lors du marquage des notifications comme lues", error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationMessage = (notification: Notification) => {
        switch (notification.notificationType) {
            case "like":
                return (
                    <>
                        <strong>{notification.actorFirstName}&nbsp;</strong>
                        {notification.actorCount > 1
                            ? ` et ${notification.actorCount - 1} autres ont liké votre ${notification.resourceType.toLowerCase()}`
                            : ` a liké votre ${notification.resourceType.toLowerCase()}`}
                    </>
                );
            case "comment":
                return (
                    <>
                        <strong>{notification.actorFirstName}&nbsp;</strong>
                        {notification.actorCount > 1
                            ? ` et ${notification.actorCount - 1} autres ont commenté votre ${notification.resourceType.toLowerCase()}`
                            : ` a commenté votre ${notification.resourceType.toLowerCase()}`}
                    </>
                );
            case "follow":
                return (
                    <>
                        <strong>{notification.actorFirstName}&nbsp;</strong>
                        {notification.actorCount > 1
                            ? ` et ${notification.actorCount - 1} autres vous suivent`
                            : ` vous suit`}
                    </>
                );
            default:
                return "Nouvelle notification";
        }
    };

    const groupNotificationsByDate = () => {
        const grouped: Record<string, Notification[]> = {};
        const today = startOfToday();

        notifications.forEach(notification => {
            const notifDate = new Date(notification.createdAt);
            let key: string;

            if (isSameDay(notifDate, today)) key = "Aujourd'hui";
            else if (isSameDay(notifDate, subDays(today, 1))) key = "Hier";
            else {
                const daysAgo = differenceInDays(today, notifDate);
                key = daysAgo <= 7 ? `Il y a ${daysAgo} jours` : "Voir plus";
            }

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(notification);
        });

        return grouped;
    };

    const groupedNotifications = groupNotificationsByDate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={() => handleMarkAsRead()}>
                <div className="relative cursor-pointer">
                    <Bell className="text-text-white w-6 h-6"/>
                    {hasUnread && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"/>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-80 bg-tertiary-black border border-gray-700 mt-2 rounded-lg p-4 shadow-lg border-none absolute -right-4">
                <div className="text-white text-sm font-semibold mb-2">Notifications</div>

                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-gray-600"/>
                        <Skeleton className="h-6 w-full bg-gray-600"/>
                        <Skeleton className="h-6 w-full bg-gray-600"/>
                    </div>
                ) : notifications.length > 0 ? (
                    Object.entries(groupedNotifications).map(([date, notifs]) => (
                        <div key={date}>
                            <div className="text-xs font-semibold text-gray-400 mb-1">{date}</div>
                            {notifs.map((notification, idx) => (
                                <div
                                    key={notification.id || `notif-${idx}`}
                                    className={`text-xs p-2 rounded-md flex items-center ${
                                        notification.isRead ? "text-gray-400" : "text-white"
                                    } hover:bg-gray-700`}
                                >
                                    {getNotificationMessage(notification)}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-xs text-center">Aucune notification</p>
                )}

                {groupedNotifications["Voir plus"] && !showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-xs text-blue-400 hover:underline mt-2"
                    >
                        Voir plus
                    </button>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}