import React from "react";
import DesktopNav from "@/app/(main)/(chat)/_components/sidebar/nav/DesktopNav";

type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = React.memo(({children}: Props) => {
    return (
        <div className="fixed flex h-[calc(100vh-150px)] pt-10 gap-4">
            <DesktopNav/>
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
});

SidebarWrapper.displayName = 'SidebarWrapper';

export default SidebarWrapper;