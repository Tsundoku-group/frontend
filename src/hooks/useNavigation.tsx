import {Archive, MessagesSquare, Users} from "lucide-react";
import {usePathname} from "next/navigation";
import {useMemo} from "react";

export const useNavigation = () => {
    const pathname = usePathname();

    return useMemo(() => [
        {
            name: "Conversations",
            href: "/conversations",
            icon: <MessagesSquare className="text-text-white"/>,
            active: pathname.startsWith("/conversations"),
        },
        {
            name: "Mes amis",
            href: "/friends",
            icon: <Users className="text-text-white"/>,
            active: pathname.startsWith("/friends"),
        },
        {
            name: "Archives",
            href: "/archives",
            icon: <Archive className="text-text-white"/>,
            active: pathname.startsWith("/archives"),
        }
    ], [pathname]);
};