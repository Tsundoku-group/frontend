import React, {useCallback, useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationList
    from "@/app/(main)/profile/[profileId]/_components/relations/_components/ProfileRelationList";
import ItemSearchProfileBar
    from "@/app/(main)/profile/[profileId]/_components/relations/_components/item/ItemSearchProfileBar";
import {
    fetchFollowedListFromProfile,
    fetchFollowersListFromProfile,
    fetchFriendsListFromProfile,
    fetchSuggestedFriendListFromProfile,
} from "@/server-actions/main/profile/actions";
import {ShowToast} from "@/components/ShowToast";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";

interface Friend {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
}

interface Suggestion {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
    commonFriendsCount: number;
}

interface Relation {
    friendshipId: number;
    friend: Friend;
}

interface ItemProfileRelationProps {
    profileId?: number;
    relationType: 'friends' | 'followed' | 'followers';
    isOwnProfile: boolean;
}

const ItemProfileRelation: React.FC<ItemProfileRelationProps> = ({profileId, relationType, isOwnProfile}) => {
    const [profileRelationList, setProfileRelationList] = useState<Relation[]>([]);
    const [filteredProfileRelations, setFilteredProfileRelations] = useState<Relation[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'friends' | 'suggestions' | null>(null);

    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [suggestionsPage, setSuggestionsPage] = useState(1);

    const offset = (currentPage - 1) * itemsPerPage;
    const suggestionsOffset = (suggestionsPage - 1) * itemsPerPage;

    const paginatedRelations = filteredProfileRelations.slice(offset, offset + itemsPerPage);
    const paginatedSuggestions = suggestions.slice(suggestionsOffset, suggestionsOffset + itemsPerPage);

    const fetchRelations = useCallback(
        async (
            type: 'friends' | 'followed' | 'followers',
            limit: number,
            offset: number
        ) => {
            try {
                let data = [];
                switch (type) {
                    case 'friends':
                        data = await fetchFriendsListFromProfile(profileId, limit, offset);
                        break;
                    case 'followed':
                        data = await fetchFollowedListFromProfile(profileId, limit, offset);
                        break;
                    case 'followers':
                        data = await fetchFollowersListFromProfile(profileId, limit, offset);
                        break;
                }
                return Array.isArray(data) ? data : [];
            } catch (error) {
                ShowToast('destructive', 'Un problème est survenu ! Veuillez réessayer plus tard.', 'Erreur');
                return [];
            }
        },
        [profileId]
    );

    const fetchSuggestions = useCallback(
        async (limit: number, offset: number) => {
            try {
                const data = await fetchSuggestedFriendListFromProfile(profileId, limit, offset);
                setSuggestions(data);
            } catch (error) {
                ShowToast('destructive', 'Un problème est survenu ! Veuillez réessayer plus tard.', 'Erreur');
            }
        },
        [profileId]
    );

    useEffect(() => {
        if (relationType === 'friends' && activeTab === 'suggestions') {
            void fetchSuggestions(itemsPerPage, suggestionsOffset);
        } else {
            setLoading(true);
            fetchRelations(relationType, itemsPerPage, offset)
                .then((data) => {
                    setProfileRelationList(data);
                    setFilteredProfileRelations(data);
                })
                .finally(() => setLoading(false));
        }
    }, [profileId, relationType, activeTab, currentPage, suggestionsPage, fetchSuggestions, suggestionsOffset, fetchRelations, offset]);

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
                    isOwnProfile={isOwnProfile}
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
                    isOwnProfile={isOwnProfile}
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
        <Card className="bg-transparent border-none p-4">
            {relationType === 'friends' ? (
                <Tabs
                    defaultValue="friends"
                    onValueChange={(value) => setActiveTab(value as 'friends' | 'suggestions')}
                >
                    <TabsList className="bg-transparent">
                        <TabsTrigger value="friends"
                                     className="text-gray-600 px-4 py-2 rounded-md focus:bg-secondary-black data-[state=active]:bg-secondary-black focus:text-white data-[state=active]:text-white">
                            {isOwnProfile ? 'Tous mes ami(e)s' : 'Tous ses ami(e)s'}
                        </TabsTrigger>
                        {isOwnProfile && (
                            <TabsTrigger value="suggestions"
                                         className="text-gray-600 px-4 py-2 rounded-md focus:bg-secondary-black data-[state=active]:bg-secondary-black focus:text-white data-[state=active]:text-white">Suggestions</TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="friends">{renderContent('friends')}</TabsContent>
                    {isOwnProfile && (
                        <TabsContent value="suggestions">{renderSuggestions()}</TabsContent>
                    )}
                </Tabs>
            ) : (
                renderContent(relationType)
            )}
        </Card>
    );
};

export default ItemProfileRelation;