"use client";

import React, {useState, useEffect} from "react";
import ItemList from "@/app/(main)/(chat)/_components/item/ItemList";
import ConversationFallBack from "@/app/(main)/(chat)/_components/conversation/ConversationFallBack";
import AddFriends from "@/app/(main)/(chat)/friends/_components/AddFriends";
import {Loader2} from "lucide-react";
import FriendsList from "@/app/(main)/(chat)/friends/_components/FriendsList";
import {fetchFriendsList} from "@/server-actions/main/chat/friends/actions";
import SearchBar from "@/app/(main)/(chat)/_components/item/ItemSearchBar";
import {useRouter} from "next/navigation";
import {startNewConversation} from "@/server-actions/main/chat/conversations/actions";
import {ShowToast} from "@/components/ShowToast";
import {useProfileContext} from "@/context/profileContext";
import {Friend} from "@/models/Friend";

const FriendsPage = React.memo(() => {
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    useEffect(() => {
        const fetchFriendsData = async () => {
            if (!profileId) return;

            setLoading(true);
            try {
                const data = await fetchFriendsList(profileId);
                setFriendList(data);
                setFilteredFriends(data);
                setAllFriends(data);
            } catch (error) {
                console.error("Erreur lors du chargement des amis", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchFriendsData();
    }, [profileId]);

    const onStartConversation = async (friendId: number) => {
        const friend = friendList.find((f) => f.friendId === friendId);
        if (!friend) return;

        try {
            const response = await startNewConversation(friend.username, friendId);

            if (response.success) {
                const newConversationId = response.conversationId;
                ShowToast("default", "Conversation créée !", "");
                router.push(`/conversations/${newConversationId}`);
            } else {
                ShowToast("destructive", "Erreur", response.error || "Erreur lors de la création de la conversations.");
            }
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";
            ShowToast("destructive", "Erreur", errorMessage);
        }
    };

    const resetSearchBarFriends = () => {
        setFilteredFriends(allFriends);
    };

    return (
        <div className="flex h-full">
                <ItemList title="Mes amis" action={<AddFriends/>}>
                    <SearchBar
                        placeholder="Rechercher un(e) ami(e)..."
                        items={friendList}
                        setFilteredItems={setFilteredFriends}
                        getLabel={(friend) => friend.username}
                        resetItems={resetSearchBarFriends}
                    />
                    {loading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-text-white"/>
                    ) : filteredFriends.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-center mb-20 text-text-white text-sm">
                            Ajoute des amis pour commencer à chatter
                        </div>
                    ) : (
                        <FriendsList
                            friends={filteredFriends}
                            loading={loading}
                            onStartConversation={onStartConversation}/>
                    )}
                </ItemList>
            <div className="ml-[calc(30svh)]">
                <ConversationFallBack/>
            </div>
        </div>
    );
});

FriendsPage.displayName = 'FriendsPage';

export default FriendsPage;