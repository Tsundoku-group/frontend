import React from "react";
import { Card } from "@/components/ui/card";

const ConversationFallBack = () => {
    return (
        <Card className="flex flex-col w-[calc(100vh)] h-[calc(100vh-145px)] p-2 overflow-hidden  items-center justify-center bg-sky-100 text-secondary-foreground">
            Select a conversation to get started!
        </Card>
    );
};

export default ConversationFallBack;