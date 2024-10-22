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

    const {user} = useAuthContext();
    const socket = useSocket();
    const userId = user?.userId;

    const fetchConversationsData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const data = await fetchUserConversations(userId);
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
        if (socket && conversations.length > 0) {
            socket.on('receive_msg', (data) => {
                const { roomId, ...messageData } = data;

                setConversations(prevConversations => prevConversations.map(conv => {
                    if (String(conv.id) === String(roomId)) {
                        return {
                            ...conv,
                            lastMessage: messageData,
                        };
                    }
                    return conv;
                }));
            });

            return () => {
                socket.off('receive_msg');
            };
        }
    }, [socket, conversations]);

    const getOtherMember = useCallback((conversation: ChatConversation) => {
        if (Array.isArray(conversation.participants)) {
            return conversation.participants.find(participant => participant.id !== userId);
        }
        return undefined;
    }, [userId]);

    const lastMessageDetails = useMemo(() => {
        return conversations.map(conversation => {
            const lastMessage = conversation.lastMessage as LastMessage || {};
            const otherMember = getOtherMember(conversation);
            return {
                id: conversation.id,
                username: otherMember?.userName || "Utilisateur inconnu",
                imageUrl: otherMember?.imageUrl || "",
                lastMessageSender: lastMessage.sent_by,
                lastMessageContent: lastMessage.content || "",
                sentAt: lastMessage.sent_at,
                isRead: lastMessage.isRead,
                isMutedUntil: conversation.isMutedUntil,
            };
        });
    }, [conversations, getOtherMember]);

    const resetSearchBarConversations = () => {
        setConversations(allConversations);
    };

    return (
        <div className="mt-16">
            <ItemList title="Conversations" action={<StartNewConversation/>}>
                <div className="fixed w-[calc(48svh)] z-50">
                    <SearchBar
                        placeholder="Rechercher une conversation..."
                        items={conversations}
                        setFilteredItems={setConversations}
                        getLabel={(conversation) => {
                            const otherMember = getOtherMember(conversation);
                            return otherMember?.userName || '';
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
                        lastMessageDetails.map(({id, username, imageUrl, lastMessageSender, lastMessageContent, sentAt, isRead, isMutedUntil}) => (
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