import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationList from "@/app/(main)/profile/[profileId]/relations/components/ProfileRelationList";
import ItemSearchProfileBar from "@/app/(main)/profile/[profileId]/relations/components/item/ItemSearchProfileBar";
import {fetchFriendsListFromProfile} from "@/app/(main)/profile/[profileId]/actions";
import {useProfileContext} from "@/context/profileContext";

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

const ItemProfileRelation = () => {
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
                const data = await fetchFriendsListFromProfile(profileId);
                setProfileRelationList(data);
                setFilteredProfileRelations(data);
                setAllProfileRelation(data);
            } catch (error: any) {

            } finally {
                setLoading(false);
            }
        }

        getFriendsList();
    }, [profileId]);

    const resetSearchProfileBar = () => {
        setFilteredProfileRelations(allProfileRelation);
    };

    return (
        <Card className="bg-tertiary-black border-none p-4">
            <div className="mb-5">
                <ItemSearchProfileBar
                    placeholder="Rechercher un(e) ami(e)..."
                    items={profileRelationList}
                    setFilteredItems={setFilteredProfileRelations}
                    getLabel={(relation) => `${relation.friend.firstname} ${relation.friend.lastname} ${relation.friend.username}`}
                    resetItems={resetSearchProfileBar}
                />
            </div>
            <div className="w-full">
                <ProfileRelationList relations={filteredProfileRelations} loading={loading} />
            </div>
        </Card>
    );
};

export default ItemProfileRelation;