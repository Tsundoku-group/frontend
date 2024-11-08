import {BellRing, Paintbrush, PersonStanding, Settings, User} from "lucide-react";
import {usePathname} from "next/navigation";
import {useMemo} from "react";

export const useSettingsNavigation = () => {
    const pathname = usePathname();

    return useMemo(() => [
        {
            name: "Profil",
            href: "/profileSettings",
            icon: <User/>,
            active: pathname.startsWith("/profileSettings"),
        },
        {
            name: "Comptes",
            href: "/accountSettings",
            icon: <Settings/>,
            active: pathname.startsWith("/accountSettings"),
        },
        {
            name: "Apparence",
            href: "/appearanceSettings",
            icon: <Paintbrush/>,
            active: pathname.startsWith("/appearanceSettings"),
        },
        {
            name: "Accessibilités",
            href: "/accessibilitySettings",
            icon: <PersonStanding/>,
            active: pathname.startsWith("/accessibilitySettings"),
        },
        {
            name: "Notifications",
            href: "/notificationSettings",
            icon: <BellRing/>,
            active: pathname.startsWith("/notificationSettings"),
        }
    ], [pathname]);
};