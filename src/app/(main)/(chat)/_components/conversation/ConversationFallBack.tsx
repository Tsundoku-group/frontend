import React from "react";
import { Card } from "@/components/ui/card";

const ConversationFallBack = () => {
    return (
        <Card className="flex flex-col w-[calc(100vh)] h-[calc(100vh-145px)] p-2 overflow-hidden  items-center justify-center bg-tertiary-black border-secondary-black border-2 text-text-white">
            Sélectionnez une conversation pour commencer !
        </Card>
    );
};

export default ConversationFallBack;