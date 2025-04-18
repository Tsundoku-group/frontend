import React from "react";

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = React.memo(({children}) => {
    return (
        <>
            {children}
        </>
    );
});

Layout.displayName = 'Layout';

export default Layout;