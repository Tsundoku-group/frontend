import React from "react";
import {Card} from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
    return (
        <Card className="flex flex-col w-[calc(100vh)] h-[calc(100vh-145px)] p-2 overflow-hidden">
            {children}
        </Card>
    );
};

export default ConversationContainer;