import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationList from "@/app/(main)/profile/[profileId]/relations/components/ProfileRelationList";
import ItemSearchProfileBar from "@/app/(main)/profile/[profileId]/relations/components/item/ItemSearchProfileBar";
import {
    fetchFollowedListFromProfile,
    fetchFollowersListFromProfile,
    fetchFriendsListFromProfile
} from "@/app/(main)/profile/[profileId]/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";

interface Friend {
    friendId: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface Relation {
    friendshipId: string;
    friend: Friend;
}

interface ItemProfileRelationProps {
    relationType: 'friends' | 'followed' | 'followers';
}

const ItemProfileRelation: React.FC<ItemProfileRelationProps> = ({ relationType }) => {
    const [profileRelationList, setProfileRelationList] = useState<Relation[]>([]);
    const [filteredProfileRelations, setFilteredProfileRelations] = useState<Relation[]>([]);
    const [allProfileRelation, setAllProfileRelation] = useState<Relation[]>([]);
    const [loading, setLoading] = useState(false);

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;

    useEffect(() => {
        const getFriendsList = async () => {
            if (!profileId) return;
            setLoading(true);

            try {
                let data: Relation[] = [];

                if (relationType === 'friends') {
                    data = await fetchFriendsListFromProfile(profileId);
                } else if (relationType === 'followed') {
                    data = await fetchFollowedListFromProfile(profileId);
                } else if (relationType === 'followers') {
                    data = await fetchFollowersListFromProfile(profileId);
                }

                setProfileRelationList(data);
                setFilteredProfileRelations(data);
                setAllProfileRelation(data);
            } catch (error: any) {
                ShowToast('destructive', 'Un problème est survenue ! Veuillez réessayer plus tard.', 'Erreur')
            } finally {
                setLoading(false);
            }
        };

        getFriendsList();
    }, [profileId, relationType]);

    const resetSearchProfileBar = () => {
        setFilteredProfileRelations(allProfileRelation);
    };

    const getPlaceholder = (type: 'friends' | 'followed' | 'followers') => {
        switch (type) {
            case 'friends':
                return 'Rechercher un(e) ami(e)...';
            case 'followed':
                return 'Rechercher un(e) utilisateur(trice) suivi(e)...';
            case 'followers':
                return 'Rechercher un(e) follower...';
            default:
                return 'Rechercher...';
        }
    };

    return (
        <Card className="bg-tertiary-black border-none p-4">
            <div className="mb-5">
                <ItemSearchProfileBar
                    placeholder={getPlaceholder(relationType)}
                    items={profileRelationList}
                    setFilteredItems={setFilteredProfileRelations}
                    getLabel={(relation) => `${relation.friend.firstname} ${relation.friend.lastname} ${relation.friend.username}`}
                    resetItems={resetSearchProfileBar}
                />
            </div>
            <div className="w-full">
                <ProfileRelationList relations={filteredProfileRelations} loading={loading} relationType={relationType}/>
            </div>
        </Card>
    );
};

export default ItemProfileRelation;