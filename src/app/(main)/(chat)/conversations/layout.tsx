'use client';

import {ChatConversation, LastMessage} from "@/models/ChatConversation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ItemList from "@/app/(main)/(chat)/_components/item/ItemList";
import {Loader2} from "lucide-react";
import DMConversationItem from "@/app/(main)/(chat)/conversations/_components/DMConversationItem";
import {fetchUserConversations} from "@/server-actions/main/chat/conversations/actions";
import StartNewConversation from "@/app/(main)/(chat)/conversations/_components/StartNewConversation";
import SearchBar from '@/app/(main)/(chat)/_components/item/ItemSearchBar';
import {useSocket} from "@/context/socketContext";
import {useProfileContext} from "@/context/profileContext";

const ConversationLayout = ({children}: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [allConversations, setAllConversations] = useState<ChatConversation[]>([]);
    const [activeConversations, setActiveConversations] = useState<Set<string>>(new Set());

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;
    const {socket} = useSocket();

    const fetchConversationsData = useCallback(async () => {
        if (!profileId) return;
        setLoading(true);

        try {
            const data: ChatConversation[] = await fetchUserConversations(profileId);

            setConversations(data);
            setAllConversations(data);

        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        void fetchConversationsData();
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
                        String(conv.id) === String(roomId) ? {...conv, lastMessage} : conv
                    );

                    const targetConvIndex = updatedConversations.findIndex(conv => String(conv.id) === String(roomId));
                    const [targetConv] = updatedConversations.splice(targetConvIndex, 1);
                    updatedConversations.unshift(targetConv);

                    return updatedConversations;
                });
            };

            socket.on('messageAlert', ({roomId, ...lastMessage}) => {
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
        if (socket && profileId) {
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
    }, [socket, profileId]);

    const getOtherMember = useCallback((conversation: ChatConversation) => {
        return conversation.participants.find(participant => participant.id !== profileId);
    }, [profileId]);

    const lastMessageDetails = useMemo(() => {
        return conversations.map(conversation => {
            const lastMessage = conversation.lastMessage as LastMessage || {};
            const otherMember = getOtherMember(conversation);

            const isReadForCurrentUser = lastMessage.sent_by === activeProfileInStorage?.username || lastMessage.isRead;

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
    }, [activeProfileInStorage?.username, conversations, getOtherMember]);

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
        <div className="flex h-full">
            <ItemList title="Conversations" action={<StartNewConversation onNewConversation={addNewConversation}/>}>
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
                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-text-white"/>
                    </div>
                ) : lastMessageDetails.length === 0 ? (
                    <div
                        className="w-full h-full flex items-center justify-center text-center mb-20 text-text-white text-sm">
                        Pas de conversation trouvée
                    </div>
                ) : (
                    lastMessageDetails.map(({
                                                id,
                                                username,
                                                imageUrl,
                                                lastMessageSender,
                                                lastMessageContent,
                                                sentAt,
                                                isRead,
                                                isMutedUntil,
                                                otherParticipantId
                                            }) => (
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
            </ItemList>
            {children}
        </div>
    );
};

export default ConversationLayout;
