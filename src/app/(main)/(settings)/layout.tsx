import React from "react";
import SettingsSidebarWrapper from "@/app/(main)/(settings)/_components/sidebar/SettingsSidebarWrapper";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = React.memo(({children}) => {
    return (
        <>
            <hr className="mt-12 bg-secondary-black"/>
            <SettingsSidebarWrapper>
                {children}
            </SettingsSidebarWrapper>
        </>
    );
});

Layout.displayName = 'Layout';

export default Layout;