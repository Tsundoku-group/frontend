import React from "react";
import {Card} from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
    return (
        <Card className="flex flex-col w-[calc(91vh)] h-[calc(100vh-155px)] p-2 overflow-hidden bg-secondary-black border-tertiary-black ">
            {children}
        </Card>
    );
};

export default ConversationContainer;