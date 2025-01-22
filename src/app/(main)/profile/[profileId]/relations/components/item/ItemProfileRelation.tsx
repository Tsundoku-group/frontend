import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationList from "@/app/(main)/profile/[profileId]/relations/components/ProfileRelationList";
import ItemSearchProfileBar from "@/app/(main)/profile/[profileId]/relations/components/item/ItemSearchProfileBar";
import {
    fetchFollowedListFromProfile,
    fetchFollowersListFromProfile,
    fetchFriendsListFromProfile,
    fetchSuggestedFriendListFromProfile,
} from "@/app/(main)/profile/[profileId]/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";

interface Friend {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface Suggestion {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
    commonFriendsCount: number;
}

interface Relation {
    friendshipId: string;
    friend: Friend;
}

interface ItemProfileRelationProps {
    relationType: 'friends' | 'followed' | 'followers';
}

const ItemProfileRelation: React.FC<ItemProfileRelationProps> = ({relationType}) => {
    const [profileRelationList, setProfileRelationList] = useState<Relation[]>([]);
    const [filteredProfileRelations, setFilteredProfileRelations] = useState<Relation[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'friends' | 'suggestions' | null>(null);

    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [suggestionsPage, setSuggestionsPage] = useState(1);

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;

    const offset = (currentPage - 1) * itemsPerPage;
    const suggestionsOffset = (suggestionsPage - 1) * itemsPerPage;

    const paginatedRelations = filteredProfileRelations.slice(offset, offset + itemsPerPage);
    const paginatedSuggestions = suggestions.slice(suggestionsOffset, suggestionsOffset + itemsPerPage);

    const fetchRelations = async (
        type: 'friends' | 'followed' | 'followers',
        limit: number,
        offset: number
    ) => {
        try {
            switch (type) {
                case 'friends':
                    return await fetchFriendsListFromProfile(profileId, limit, offset);
                case 'followed':
                    return await fetchFollowedListFromProfile(profileId, limit, offset);
                case 'followers':
                    return await fetchFollowersListFromProfile(profileId, limit, offset);
                default:
                    return [];
            }
        } catch (error) {
            ShowToast('destructive', 'Un problème est survenu ! Veuillez réessayer plus tard.', 'Erreur');
            return [];
        }
    };

    const fetchSuggestions = async (limit: number, offset: number) => {
        try {
            const data = await fetchSuggestedFriendListFromProfile(profileId, limit, offset);
            setSuggestions(data);
        } catch (error) {
            ShowToast('destructive', 'Un problème est survenu ! Veuillez réessayer plus tard.', 'Erreur');
        }
    };

    useEffect(() => {
        if (relationType === 'friends' && activeTab === 'suggestions') {
            fetchSuggestions(itemsPerPage, suggestionsOffset);
        } else {
            setLoading(true);
            fetchRelations(relationType, itemsPerPage, offset)
                .then((data) => {
                    setProfileRelationList(data);
                    setFilteredProfileRelations(data);
                })
                .finally(() => setLoading(false));
        }
    }, [profileId, relationType, activeTab, currentPage, suggestionsPage]);

    const resetSearchProfileBar = () => {
        setFilteredProfileRelations(profileRelationList);
    };

    const getPlaceholder = (type: string) => {
        switch (type) {
            case 'friends':
                return 'Rechercher un(e) ami(e)...';
            case 'followed':
                return 'Rechercher un(e) utilisateur(trice) suivi(e)...';
            case 'followers':
                return 'Rechercher un(e) follower...';
            case 'suggestions':
                return 'Rechercher de nouveaux ami(e)s...';
            default:
                return 'Rechercher...';
        }
    };

    const renderSuggestions = () => (
        <>
            <div className="mb-5">
                <ItemSearchProfileBar
                    placeholder="Rechercher de nouveaux ami(e)s..."
                    items={suggestions}
                    setFilteredItems={setSuggestions}
                    getLabel={(suggestion) =>
                        `${suggestion.firstname} ${suggestion.lastname} (${suggestion.username})`
                    }
                    resetItems={() => setSuggestions(suggestions)}
                />
            </div>
            <div className="w-full">
                <ProfileRelationList
                    relations={paginatedSuggestions.map((s) => ({
                        friendshipId: null,
                        friend: {
                            friendId: s.friendId,
                            firstname: s.firstname,
                            lastname: s.lastname,
                            username: s.username,
                            commonFriendsCount: s.commonFriendsCount,
                        },
                    }))}
                    loading={loading}
                    relationType="suggestions"
                />
            </div>
            <div className="flex justify-between mt-4">
                <Button
                    className="btn btn-primary cursor-pointer"
                    disabled={suggestionsPage === 1}
                    onClick={() => setSuggestionsPage((prev) => Math.max(prev - 1, 1))}
                >
                    Précédent
                </Button>
                <Button
                    className="btn btn-primary cursor-pointer"
                    disabled={paginatedSuggestions.length < itemsPerPage}
                    onClick={() => setSuggestionsPage((prev) => prev + 1)}
                >
                    Suivant
                </Button>
            </div>
        </>
    );

    const renderContent = (type: 'friends' | 'followed' | 'followers') => (
        <>
            <div className="mb-5">
                <ItemSearchProfileBar
                    placeholder={getPlaceholder(type)}
                    items={profileRelationList}
                    setFilteredItems={setFilteredProfileRelations}
                    getLabel={(relation) =>
                        `${relation.friend.firstname} ${relation.friend.lastname} ${relation.friend.username}`
                    }
                    resetItems={resetSearchProfileBar}
                />
            </div>
            <div className="w-full">
                <ProfileRelationList
                    relations={paginatedRelations}
                    loading={loading}
                    relationType={type}
                />
            </div>
            <div className="flex justify-between mt-4">
                <Button
                    className="btn btn-primary cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Précédent
                </Button>
                <Button
                    className="btn btn-primary cursor-pointer"
                    disabled={paginatedRelations.length < itemsPerPage}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Suivant
                </Button>
            </div>
        </>
    );

    return (
        <Card className="bg-tertiary-black border-none p-4">
            {relationType === 'friends' ? (
                <Tabs
                    defaultValue="friends"
                    className="w-full"
                    onValueChange={(value) => setActiveTab(value as 'friends' | 'suggestions')}
                >
                    <TabsList>
                        <TabsTrigger value="friends">Tous mes ami(e)s</TabsTrigger>
                        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="friends">{renderContent('friends')}</TabsContent>
                    <TabsContent value="suggestions">{renderSuggestions()}</TabsContent>
                </Tabs>
            ) : (
                renderContent(relationType)
            )}
        </Card>
    );
};

export default ItemProfileRelation;