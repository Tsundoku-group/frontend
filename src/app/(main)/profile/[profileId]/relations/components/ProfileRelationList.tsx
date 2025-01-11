import React from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationCard from "@/app/(main)/profile/[profileId]/relations/components/ProfileRelationCard";

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

interface ListProfileRelation {
    relations: Relation[];
    loading: boolean;
}

const ProfileRelationList = React.memo(({relations, loading}: ListProfileRelation) => {
    if (loading) {
        return <p>Chargement des amis...</p>;
    }

    return (
        <Card className="bg-tertiary-black border-none p-2">
            <div className="grid grid-cols-2 gap-4 ">
                {Array.isArray(relations) && relations.length > 0 ? (
                    relations.map((relation: Relation) => (
                        <ProfileRelationCard
                            key={relation.friendshipId}
                            friendshipId={relation.friendshipId}
                            friend={relation.friend}
                        />
                    ))
                ) : (
                    <p>Aucun ami trouvé.</p>
                )}
            </div>
        </Card>
    )
})

ProfileRelationList.displayName = 'ProfileRelationList';

export default ProfileRelationList;