import React from "react";
import SettingsNav from "@/app/(main)/(settings)/_components/sidebar/nav/SettingsNav";

type Props = React.PropsWithChildren<{}>;

const SettingsSidebarWrapper = React.memo(({ children }: Props) => {
    return (
        <div className="flex h-screen mt-6">
            <SettingsNav />
            <main className="flex-grow flex justify-center items-center">
                <div className="w-full h-full">
                    {children}
                </div>
            </main>
        </div>
    );
});

SettingsSidebarWrapper.displayName = 'SettingsSidebarWrapper';

export default SettingsSidebarWrapper;