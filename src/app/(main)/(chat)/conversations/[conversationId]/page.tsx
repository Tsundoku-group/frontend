'use client';

import React from "react";
import ConversationView from "@/app/(main)/(chat)/components/conversation/ConversationView";

type Props = {
    params: {
        conversationId: string;
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