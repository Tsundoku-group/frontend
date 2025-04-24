'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Loader2} from 'lucide-react';
import ArchivesConversationItem from '@/app/(main)/(chat)/archives/components/ArchivesConversationItem';
import ItemList from '@/app/(main)/(chat)/_components/item/ItemList';
import {fetchArchivedConversations, handleUnarchiveAllConversations} from '@/server-actions/main/chat/archives/actions';
import SearchBar from '@/app/(main)/(chat)/_components/item/ItemSearchBar';
import {Checkbox} from "@/components/ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import {ChatConversation, LastMessage} from "@/models/ChatConversation";
import {ShowToast} from "@/components/ShowToast";
import {useProfileContext} from "@/context/profileContext";

const ArchivesLayout = ({ children }: { children: React.ReactNode }) => {
    const [archivesConversation, setArchivesConversation] = useState<ChatConversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([]);
    const [selectedConversations, setSelectedConversations] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const fetchArchivedConversationsData = useCallback(async () => {
        if (!profileId) return;

        setLoading(true);
        try {
            const data = await fetchArchivedConversations(profileId);
            setArchivesConversation(data);
            setFilteredConversations(data);
        } catch (error) {
            setArchivesConversation([]);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        if (profileId) {
            void fetchArchivedConversationsData();
        }
    }, [fetchArchivedConversationsData, profileId]);

    const getOtherMember = useCallback((conversation: ChatConversation) => {
        if (Array.isArray(conversation.participants)) {
            return conversation.participants.find(participant => participant.id !== profileId);
        }
        return undefined;
    }, [profileId]);

    const archivesConversationDetails = useMemo(() => {
        return archivesConversation.map(conversation => {
            const lastMessage = conversation.lastMessage as LastMessage|| {};
            const otherMember = getOtherMember(conversation);
            return {
                id: conversation.id,
                username: otherMember?.username || "Utilisateur inconnu",
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

    const toggleSelectConversation = (conversationId: number) => {
        const updatedSelection = new Set(selectedConversations);
        if (updatedSelection.has(conversationId)) {
            updatedSelection.delete(conversationId);
        } else {
            updatedSelection.add(conversationId);
        }
        setSelectedConversations(updatedSelection);
    };

    const handleUnarchiveSelected = async (profileId: number) => {
        try {
            await handleUnarchiveAllConversations(profileId);
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
        <div className="flex h-full">
            <ItemList title="Archives">
                <SearchBar
                    placeholder="Rechercher une conversation..."
                    items={archivesConversation}
                    setFilteredItems={setFilteredConversations}
                    getLabel={(conversation) => {
                        const otherMember = getOtherMember(conversation);
                        return otherMember?.username || '';
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
                            onClick={() => handleUnarchiveSelected(profileId)}
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
                                setArchivesConversation={setArchivesConversation}
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