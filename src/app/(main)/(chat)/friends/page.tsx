"use client";

import React, {useState, useEffect} from "react";
import ItemList from "../components/item/ItemList";
import ConversationFallBack from "../components/conversation/ConversationFallBack";
import AddFriends from "./components/AddFriends";
import {Loader2} from "lucide-react";
import FriendsList from "@/app/(main)/(chat)/friends/components/FriendsList";
import {fetchFriendsList} from "./actions";
import {useAuthContext} from "@/context/authContext";
import SearchBar from "@/app/(main)/(chat)/components/item/ItemSearchBar";
import {useRouter} from "next/navigation";
import {startNewConversation} from "@/app/(main)/(chat)/conversations/actions";
import {ShowToast} from "@/components/ShowToast";

type Friend = {
    id: string;
    userName: string;
    email: string;
    imageUrl?: string;
};

const FriendsPage = React.memo(() => {
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [allFriends, setAllFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const {user} = useAuthContext();
    const userId = user?.userId as string;

    useEffect(() => {
        const fetchFriendsData = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const data = await fetchFriendsList(userId);
                setFriendList(data);
                setFilteredFriends(data);
                setAllFriends(data);
            } catch (error) {
                console.error("Erreur lors du chargement des amis", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsData();
    }, [userId]);

    const onStartConversation = async (friendId: string) => {
        const friend = friendList.find((f) => f.id === friendId);
        if (!friend) return;

        try {
            const response = await startNewConversation(user.email as string, friendId);

            if (response.success) {
                const newConversationId = response.conversationId;
                ShowToast("default", "Conversation créée !", "");
                router.push(`/conversations/${newConversationId}`);
            } else {
                ShowToast("destructive", "Erreur", response.error || "Erreur lors de la création de la conversation.");
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
        <div className="flex mt-16 h-full">
            <div className="w-1/3">
                <ItemList title="Friends" action={<AddFriends/>}>
                    <SearchBar
                        placeholder="Rechercher un(e) ami(e)..."
                        items={friendList}
                        setFilteredItems={setFilteredFriends}
                        getLabel={(friend) => friend.userName || friend.email}
                        resetItems={resetSearchBarFriends}
                    />
                    {loading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto"/>
                    ) : filteredFriends.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center text-center mb-20">
                            Ajoute des amis pour commencer à chatter
                        </p>
                    ) : (
                        <FriendsList friends={filteredFriends} loading={loading} onStartConversation={onStartConversation}/>
                    )}
                </ItemList>
            </div>
            <div className="ml-80 w-2/3">
                <ConversationFallBack/>
            </div>
        </div>
    );
});

FriendsPage.displayName = 'FriendsPage';

export default FriendsPage;