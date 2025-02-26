"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNotifications } from "@/components/navbar/actions";
import { useProfileContext } from "@/context/profileContext";

interface Notification {
    id: string;
    actorId: string;
    notificationType: "like" | "comment" | "follow";
    resourceType: "POST" | "COMMENT" | "FOLLOW";
    resourceId: string;
    createdAt: string;
    isRead: boolean;
}

export default function NotificationDropdown() {
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!profileId) return;

        const loadNotifications = async () => {
            try {
                const data = await fetchNotifications(profileId);
                if (Array.isArray(data)) {
                    const uniqueNotifications = Array.from(new Map(data.map(n => [n.id, n])).values());
                    setNotifications(uniqueNotifications);
                } else {
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des notifications", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [profileId]);

    const getNotificationMessage = (notification: Notification) => {
        switch (notification.notificationType) {
            case "like":
                return `L'utilisateur ${notification.actorId} a liké votre ${notification.resourceType.toLowerCase()}`;
            case "comment":
                return `L'utilisateur ${notification.actorId} a commenté votre ${notification.resourceType.toLowerCase()}`;
            case "follow":
                return `L'utilisateur ${notification.actorId} vous suit maintenant`;
            default:
                return "Nouvelle notification";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative cursor-pointer">
                    <Bell className="text-text-white w-6 h-6" />
                    {notifications.some((n) => !n.isRead) && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-tertiary-black border border-gray-700 mt-2 rounded-lg p-4 shadow-lg border-none absolute -right-4">
                <div className="text-white text-sm font-semibold mb-2">Notifications</div>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-gray-600" />
                        <Skeleton className="h-6 w-full bg-gray-600" />
                        <Skeleton className="h-6 w-full bg-gray-600" />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`text-sm p-2 rounded-md flex items-center justify-between ${
                                notification.isRead ? "text-gray-400" : "text-white font-semibold"
                            } hover:bg-gray-700`}
                        >
                            {getNotificationMessage(notification)}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-xs text-center">Aucune notification</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}