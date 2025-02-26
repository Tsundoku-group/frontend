"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNotifications } from "@/components/navbar/actions";
import { useProfileContext } from "@/context/profileContext";

interface Notification {
    id: string;
    message: string;
    type: "LIKE" | "COMMENT" | "FOLLOW";
    createdAt: string;
    read: boolean;
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative cursor-pointer">
                    <Bell className="text-text-white w-6 h-6" />
                    {notifications.some((n) => !n.read) && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-tertiary-black border border-gray-700 mt-2 rounded-lg p-2 shadow-lg">
                <h3 className="text-white text-sm font-semibold mb-2">Notifications</h3>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full bg-gray-600" />
                        <Skeleton className="h-6 w-full bg-gray-600" />
                        <Skeleton className="h-6 w-full bg-gray-600" />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification.id} className="text-sm text-gray-300 p-2 hover:bg-gray-700 rounded-md">
                            {notification.message}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-xs text-center">Aucune notification</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}