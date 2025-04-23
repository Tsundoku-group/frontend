'use client';

import React, {useEffect, useState, useRef, useMemo, useCallback} from "react";
import ConversationContainer from "@/app/(main)/(chat)/_components/conversation/ConversationContainer";
import {Loader2} from "lucide-react";
import Header from "@/app/(main)/(chat)/conversations/[conversationId]/components/header/Header";
import ChatInput from "@/app/(main)/(chat)/conversations/[conversationId]/components/Input/Input";
import {
    fetchMarkMessagesAsRead,
    fetchMessagesFromConversationId,
    fetchOneConversationById
} from "@/server-actions/main/chat/conversations/actions";
import Body from "@/app/(main)/(chat)/conversations/[conversationId]/components/body/Body";
import {useAuthContext} from "@/context/authContext";
import {useSocket} from "@/context/socketContext";
import {ChatParticipant} from "@/models/ChatConversation";
import {useProfileContext} from "@/context/profileContext";

type Props = {
    conversationId: number;
    context?: "archive" | "active";
};

type Message = {
    id: number;
    content: string;
    sender_id: number;
    sent_by: string;
    sent_at: string;
    sender_email: string;
    isRead: boolean;
    isCurrentUser: boolean;
};

const ConversationView = React.memo(({conversationId}: Props) => {
    const [state, setState] = useState({
        messages: [] as Message[],
        participants: [] as ChatParticipant[],
        loading: true,
    });

    const {messages, participants, loading} = state;

    const {user} = useAuthContext();
    const {socket} = useSocket();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const otherParticipant = useMemo(() => {
        return participants.find(participant => participant.username !== activeProfileInStorage?.username);
    }, [participants, activeProfileInStorage?.username]);

    const otherParticipantName = otherParticipant?.username || "";
    const fetchData = useCallback(async () => {
        setState(prev => ({...prev, loading: true}));

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
            setState(prev => ({...prev, loading: false}));
        }
    }, [conversationId]);

    useEffect(() => {
        const run = async () => {
            try {
                await fetchData();
            } catch (err) {
                console.error("Erreur dans fetchData:", err);
            }
        };
        void run();
    }, [fetchData]);

    useEffect(() => {
        const markUnreadMessagesAsRead = async () => {
            if (!otherParticipant?.id || !messages.length) return;

            const unreadMessages = messages.filter(
                (message) => message.sender_id === otherParticipant.id && !message.isRead
            );

            if (!unreadMessages.length) return;

            try {
                const response = await fetchMarkMessagesAsRead(conversationId, profileId);

                if (response.response) {
                    setState(prev => ({
                        ...prev,
                        messages: prev.messages.map((message) =>
                            message.sender_id === otherParticipant.id && !message.isRead
                                ? {...message, isRead: true}
                                : message
                        ),
                    }));

                    socket?.emit('markAsRead', {
                        conversationId,
                        profileId: profileId,
                    });
                } else {
                    console.error("Erreur lors de la mise à jour du message comme lu :", response);
                }
            } catch (error) {
                console.error("Erreur lors de la requête pour marquer les messages comme lus :", error);
            }
        };

        markUnreadMessagesAsRead().catch(console.error);
    }, [socket, messages, conversationId, otherParticipant, profileId]);

    return (
        <div className="ml-80">
            <ConversationContainer>
                <Header name={otherParticipantName} imageUrl={otherParticipant?.imageUrl}
                        otherParticipantId={otherParticipant?.id as number}/>
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                ) : (
                    <>
                        <div ref={messageContainerRef} className="flex-1 w-full overflow-y-auto flex flex-col-reverse">
                            <Body
                                profileId={profileId}
                                messages={state.messages}
                                conversationId={conversationId}
                            />
                        </div>
                        <ChatInput conversationId={conversationId} otherParticipant={otherParticipant}/>
                    </>
                )}
            </ConversationContainer>
        </div>
    );
});

ConversationView.displayName = 'ConversationView';

export default ConversationView;