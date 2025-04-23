'use client';

import React from "react";
import ConversationView from "@/app/(main)/(chat)/_components/conversation/ConversationView";

type Props = {
    params: {
        conversationId: number;
    }
};

const ArchivedConversationPage = ({ params: { conversationId } }: Props) => {
    return (
        <div>
            <ConversationView conversationId={conversationId} context="archive" />
        </div>
    );
};

export default ArchivedConversationPage;