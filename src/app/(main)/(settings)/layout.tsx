"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SettingsSidebarWrapper from "@/app/(main)/(settings)/_components/sidebar/SettingsSidebarWrapper";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
    accessibilitySettings: "Accessibilité",
    accountSettings: "Compte",
    appearanceSettings: "Apparence",
    notificationSettings: "Notifications",
    profileSettings: "Profil",
};

const getLastSegment = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? "";
};

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = React.memo(({ children }) => {
    const pathname = usePathname();
    const lastSegment = getLastSegment(pathname);
    const pageTitle = pageTitles[lastSegment] || "Paramètres";

    return (
        <>
            <hr className="mt-8 mb-2 bg-secondary-black" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/profileSettings">Paramètres</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{`Paramètres ${pageTitle.toLowerCase()}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <SettingsSidebarWrapper>
                {children}
            </SettingsSidebarWrapper>
        </>
    );
});

Layout.displayName = "Layout";

export default Layout;