import React from "react";
import SidebarWrapper from "@/app/(main)/(chat)/components/sidebar/SidebarWrapper";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = React.memo(({children}) => {
    return (
        <>
            <SidebarWrapper>
                {children}
            </SidebarWrapper>
        </>
    );
});

Layout.displayName = 'Layout';

export default Layout;