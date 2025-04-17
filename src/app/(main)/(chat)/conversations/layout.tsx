'use client';

import {ChatConversation, LastMessage} from "@/models/ChatConversation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ItemList from "@/app/(main)/(chat)/components/item/ItemList";
import {Loader2} from "lucide-react";
import DMConversationItem from "@/app/(main)/(chat)/conversations/components/DMConversationItem";
import {useAuthContext} from "@/context/authContext";
import {fetchUserConversations} from "@/app/(main)/(chat)/conversations/actions";
import StartNewConversation from "@/app/(main)/(chat)/conversations/components/StartNewConversation";
import SearchBar from '@/app/(main)/(chat)/components/item/ItemSearchBar';
import {useSocket} from "@/context/socketContext";

const ConversationLayout = ({children}: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [allConversations, setAllConversations] = useState<ChatConversation[]>([]);
    const [activeConversations, setActiveConversations] = useState<Set<string>>(new Set());

    const {user} = useAuthContext();
    const {socket} = useSocket();
    const userId = user?.userId;

    const fetchConversationsData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);

        try {
            const data: ChatConversation[] = await fetchUserConversations(userId);

            setConversations(data);
            setAllConversations(data);

        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchConversationsData();
    }, [fetchConversationsData]);

    useEffect(() => {
        if (socket) {
            socket.on('bothInConversation', ({roomId}) => {
                setActiveConversations((prev) => new Set(prev).add(roomId));
            });

            socket.on('lastMessageUpdate', ({roomId, ...lastMessage}) => {
                setConversations((prevConversations) =>
                    prevConversations.map((conv) =>
                        String(conv.id) === String(roomId) ? {...conv, lastMessage} : conv
                    )
                );
            });

            const moveConversationToTop = (roomId: any, lastMessage: any) => {
                setConversations((prevConversations) => {
                    const updatedConversations = prevConversations.map((conv) =>
                        String(conv.id) === String(roomId) ? { ...conv, lastMessage } : conv
                    );

                    const targetConvIndex = updatedConversations.findIndex(conv => String(conv.id) === String(roomId));
                    const [targetConv] = updatedConversations.splice(targetConvIndex, 1);
                    updatedConversations.unshift(targetConv);

                    return updatedConversations;
                });
            };

            socket.on('messageAlert', ({ roomId, ...lastMessage }) => {
                moveConversationToTop(roomId, lastMessage);
            });

            return () => {
                socket.off('bothInConversation');
                socket.off('lastMessageUpdate');
                socket.off('messageAlert');
            };
        }
    }, [socket, activeConversations]);

    useEffect(() => {
        if (socket && userId) {
            socket.on('conversationRead', ({conversationId}) => {

                setConversations((prevConversations) =>
                    prevConversations.map((conv) => {
                        if (String(conv.id) === String(conversationId) && conv.lastMessage) {
                            return {
                                ...conv,
                                lastMessage: {
                                    ...conv.lastMessage,
                                    isRead: true,
                                },
                            };
                        }
                        return conv;
                    })
                );
            });

            return () => {
                socket.off('conversationRead');
            };
        }
    }, [socket, userId]);

    const getOtherMember = useCallback((conversation: ChatConversation) => {
        return conversation.participants.find(participant => participant.id !== userId);
    }, [userId]);

    const lastMessageDetails = useMemo(() => {
        return conversations.map(conversation => {
            const lastMessage = conversation.lastMessage as LastMessage || {};
            const otherMember = getOtherMember(conversation);

            const isReadForCurrentUser = lastMessage.sent_by === user?.email || lastMessage.isRead;

            return {
                id: conversation.id,
                username: otherMember?.username || "Utilisateur inconnu",
                imageUrl: otherMember?.imageUrl || "",
                lastMessageSender: lastMessage.sent_by,
                lastMessageContent: lastMessage.content || "",
                sentAt: lastMessage.sent_at,
                isRead: isReadForCurrentUser,
                isMutedUntil: conversation.isMutedUntil,
                otherParticipantId: otherMember?.id
            };
        });
    }, [conversations, getOtherMember, user?.email]);

    const resetSearchBarConversations = useCallback(() => {
        setConversations(allConversations);
    }, [allConversations]);

    const addNewConversation = useCallback((newConversation: ChatConversation) => {
        setConversations((prevConversations) => [newConversation, ...prevConversations]);
    }, [setConversations]);

    const updateConversations = useCallback((updateFn: React.SetStateAction<ChatConversation[]>) => {
        setConversations(updateFn);
    }, [setConversations]);

    return (
        <div className="mt-16">
            <ItemList title="Conversations" action={<StartNewConversation onNewConversation={addNewConversation} />}>
                <div className="fixed w-[calc(48svh)] z-50">
                    <SearchBar
                        placeholder="Rechercher une conversation..."
                        items={conversations}
                        setFilteredItems={setConversations}
                        getLabel={(conversation) => {
                            const otherMember = getOtherMember(conversation);
                            return otherMember?.username || '';
                        }}
                        resetItems={resetSearchBarConversations}
                    />
                </div>
                <div className="mt-14 w-full">
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin"/>
                        </div>
                    ) : lastMessageDetails.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center">
                            Pas de conversation trouvée
                        </p>
                    ) : (
                        lastMessageDetails.map(({id, username, imageUrl, lastMessageSender, lastMessageContent, sentAt, isRead, isMutedUntil, otherParticipantId}) => (
                            <DMConversationItem
                                key={id}
                                id={id}
                                username={username}
                                imageUrl={imageUrl}
                                lastMessageContent={lastMessageContent}
                                lastMessageSender={lastMessageSender}
                                sentAt={sentAt}
                                isRead={isRead}
                                isMutedUntil={isMutedUntil}
                                otherParticipantId={otherParticipantId}
                                setConversations={updateConversations}
                            />
                        ))
                    )}
                </div>
            </ItemList>
            {children}
        </div>
    );
};

export default ConversationLayout;
