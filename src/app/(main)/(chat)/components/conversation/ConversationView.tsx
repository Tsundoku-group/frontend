'use client';

import React, {useEffect, useState, useRef, useMemo, useCallback} from "react";
import ConversationContainer from "@/app/(main)/(chat)/components/conversation/ConversationContainer";
import {Loader2} from "lucide-react";
import Header from "@/app/(main)/(chat)/conversations/[conversationId]/components/header/Header";
import ChatInput from "@/app/(main)/(chat)/conversations/[conversationId]/components/Input/Input";
import {
    fetchMarkMessagesAsRead,
    fetchMessagesFromConversationId,
    fetchOneConversationById
} from "@/app/(main)/(chat)/conversations/actions";
import Body from "@/app/(main)/(chat)/conversations/[conversationId]/components/body/Body";
import {useAuthContext} from "@/context/authContext";
import {useSocket} from "@/context/socketContext";
import {ChatParticipant} from "@/models/ChatConversation";

type Props = {
    conversationId: string;
    context?: "archive" | "active";
};

type Message = {
    id: string;
    content: string;
    sender_id: string;
    sent_by: string;
    sent_at: string;
    sender_email: string;
    isRead: boolean;
    isCurrentUser: boolean;
};

const ConversationView = React.memo(({conversationId, context = "active"}: Props) => {
    const [state, setState] = useState({
        messages: [] as Message[],
        participants: [] as ChatParticipant[],
        loading: true,
    });

    const {messages, participants, loading} = state;

    const {user} = useAuthContext();
    const socket = useSocket();
    const userEmail = user?.email as string;
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const otherParticipant = useMemo(() => {
        return participants.find(participant => participant.email !== userEmail);
    }, [participants, userEmail]);

    const otherParticipantName = otherParticipant?.userName || "";

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        try {
            const [messagesData, participantsData] = await Promise.all([
                fetchMessagesFromConversationId(conversationId),
                fetchOneConversationById(conversationId)
            ]);
            setState({
                messages: Array.isArray(messagesData) ? messagesData : [],
                participants: participantsData || [],
                loading: false,
            });
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [conversationId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const markUnreadMessagesAsRead = async () => {
            const otherUserEmail = otherParticipant?.email;

            if (!otherUserEmail || !messages.length) return;

            const unreadMessages = messages.filter(
                (message) => message.sender_email === otherUserEmail && !message.isRead
            );

            if (!unreadMessages.length) return;

            try {
                const response = await fetchMarkMessagesAsRead(conversationId, otherUserEmail);

                if (response.response) {
                    setState(prev => ({
                        ...prev,
                        messages: prev.messages.map((message) =>
                            message.sender_email === otherUserEmail && !message.isRead
                                ? {...message, isRead: true}
                                : message
                        ),
                    }));

                    socket?.emit('markAsRead', {
                        conversationId,
                        userId: user?.userId,
                    });
                } else {
                    console.error("Erreur lors de la mise à jour du message comme lu :", response);
                }
            } catch (error) {
                console.error("Erreur lors de la requête pour marquer les messages comme lus :", error);
            }
        };

        if (socket && user?.userId) {
            markUnreadMessagesAsRead();
        }
    }, [socket, messages, conversationId, otherParticipant, user?.userId]);

    return (
        <div className="ml-80">
            <ConversationContainer>
                <Header name={otherParticipantName} imageUrl={otherParticipant?.imageUrl}/>
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                ) : (
                    <>
                        <div ref={messageContainerRef} className="flex-1 w-full overflow-y-auto flex flex-col-reverse">
                            <Body
                                userEmail={userEmail}
                                messages={messages}
                                conversationId={conversationId}
                                setMessages={(newMessages) => setState(prev => ({
                                    ...prev,
                                    messages: newMessages as unknown as Message[],
                                }))}
                            />
                        </div>
                        <ChatInput conversationId={conversationId}/>
                    </>
                )}
            </ConversationContainer>
        </div>
    );
});

export default ConversationView;