import React from "react";
import DesktopNav from "@/app/(main)/(chat)/_components/sidebar/nav/DesktopNav";

type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = React.memo(({children}: Props) => {
    return (
        <div className="fixed flex h-[calc(100vh-80px)] pt-16 gap-4 -ml-16">
            <DesktopNav/>
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
});

SidebarWrapper.displayName = 'SidebarWrapper';

export default SidebarWrapper;