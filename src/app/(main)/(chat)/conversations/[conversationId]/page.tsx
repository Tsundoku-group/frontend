'use client';

import React from "react";
import ConversationView from "@/app/(main)/(chat)/_components/conversation/ConversationView";

type Props = {
    params: {
        conversationId: number;
    }
};

const ConversationPage = React.memo(({ params: { conversationId } }: Props) => {
    return (
        <div>
            <ConversationView conversationId={conversationId} context="active" />
        </div>
    );
});

ConversationPage.displayName = 'ConversationPage';

export default ConversationPage;