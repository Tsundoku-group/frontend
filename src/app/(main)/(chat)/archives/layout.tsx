'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Loader2} from 'lucide-react';
import ArchivesConversationItem from '@/app/(main)/(chat)/archives/components/ArchivesConversationItem';
import ItemList from '@/app/(main)/(chat)/components/item/ItemList';
import {fetchArchivedConversations, handleUnarchiveAllConversations} from '@/app/(main)/(chat)/archives/actions';
import {useAuthContext} from '@/context/authContext';
import SearchBar from '@/app/(main)/(chat)/components/item/ItemSearchBar';
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {ChatConversation, LastMessage} from "@/models/ChatConversation";
import {ShowToast} from "@/components/ShowToast";

const ArchivesLayout = ({ children }: { children: React.ReactNode }) => {
    const [archivesConversation, setArchivesConversation] = useState<ChatConversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([]);
    const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useAuthContext();
    const userId = user?.userId;

    const fetchArchivedConversationsData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const data = await fetchArchivedConversations(userId);
            setArchivesConversation(data);
            setFilteredConversations(data);
        } catch (error) {
            setArchivesConversation([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchArchivedConversationsData();
        }
    }, [fetchArchivedConversationsData, userId]);

    const getOtherMember = useCallback((conversation: ChatConversation) => {
        if (Array.isArray(conversation.participants)) {
            return conversation.participants.find(participant => participant.id !== userId);
        }
        return undefined;
    }, [userId]);

    const archivesConversationDetails = useMemo(() => {
        return archivesConversation.map(conversation => {
            const lastMessage = conversation.lastMessage as LastMessage|| {};
            const otherMember = getOtherMember(conversation);
            return {
                id: conversation.id,
                username: otherMember?.userName || "Utilisateur inconnu",
                imageUrl: otherMember?.imageUrl || "",
                lastMessageSender: lastMessage.sent_by || "Inconnu",
                lastMessageContent: lastMessage.content || "",
                archivedAt: conversation.archivedAt,
                sentAt: lastMessage.sent_at,
            };
        });
    }, [archivesConversation, getOtherMember]);

    const toggleSelectAll = (isChecked: CheckedState) => {
        if (isChecked) {
            const allIds = new Set(filteredConversations.map(conversation => conversation.id));
            setSelectedConversations(allIds);
        } else {
            setSelectedConversations(new Set());
        }
    };

    const toggleSelectConversation = (conversationId: string) => {
        const updatedSelection = new Set(selectedConversations);
        if (updatedSelection.has(conversationId)) {
            updatedSelection.delete(conversationId);
        } else {
            updatedSelection.add(conversationId);
        }
        setSelectedConversations(updatedSelection);
    };

    const handleUnarchiveSelected = async (userId: string) => {
        try {
            await handleUnarchiveAllConversations(userId);
            ShowToast('default', 'Toutes les conversations ont bien été désarchivées !');
        } catch (error) {
            const errorMessage = (error as Error).message || 'Il y a eu un problème avec votre demande.';
            ShowToast('destructive', errorMessage);
        }
    };

    const resetSearchBarConversations = () => {
        setFilteredConversations(archivesConversation);
    };

    return (
        <div className="mt-16">
            <ItemList title="Archives">
                <SearchBar
                    placeholder="Rechercher une conversation..."
                    items={archivesConversation}
                    setFilteredItems={setFilteredConversations}
                    getLabel={(conversation) => {
                        const otherMember = getOtherMember(conversation);
                        return otherMember?.userName || '';
                    }}
                    resetItems={resetSearchBarConversations}
                />
                <div className="grid grid-cols-3 items-center mt-2 text-xs">
                    <div className="flex mr-5 items-center">
                        <Checkbox
                            onCheckedChange={(isChecked) => toggleSelectAll(isChecked)}
                            checked={selectedConversations.size === filteredConversations.length && filteredConversations.length > 0}
                            className="mr-1"
                        />
                        <span>Tout sélectionner</span>
                    </div>
                    {selectedConversations.size > 0 && (
                        <a
                            href="#"
                            onClick={() => handleUnarchiveSelected(userId)}
                            className="text-blue-500 hover:underline ml-10 cursor-pointer col-start-3"
                        >
                            Désarchiver tout
                        </a>
                    )}
                </div>
                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin"/>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <p className="w-full h-full flex items-center justify-center">
                        Pas de conversation trouvée
                    </p>
                ) : (
                    archivesConversationDetails.map(({id, username, imageUrl, lastMessageSender, lastMessageContent, archivedAt}) => {
                        return (
                            <ArchivesConversationItem
                                key={id}
                                id={id}
                                username={username}
                                imageUrl={imageUrl}
                                lastMessageContent={lastMessageContent}
                                lastMessageSender={lastMessageSender}
                                archivedAt={archivedAt || "Date inconnue"}
                                isChecked={selectedConversations.has(id)}
                                onChange={() => toggleSelectConversation(id)}
                            />
                        );
                    })
                )}
            </ItemList>
            {children}
        </div>
    );
};

export default ArchivesLayout;