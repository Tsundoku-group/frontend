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
    relationType: 'friends' | 'followed' | 'followers';
}

const ProfileRelationList = React.memo(({relations, loading, relationType}: ListProfileRelation) => {
    const getText = (type: 'friends' | 'followed' | 'followers') => {
        switch (type) {
            case 'friends':
                return { loading: 'Chargement des amis...', empty: 'Aucun ami trouvé.' };
            case 'followed':
                return { loading: 'Chargement des utilisateurs suivis...', empty: 'Aucun utilisateur suivi trouvé.' };
            case 'followers':
                return { loading: 'Chargement des followers...', empty: 'Aucun follower trouvé.' };
            default:
                return { loading: 'Chargement...', empty: 'Aucun résultat trouvé.' };
        }
    };

    const text = getText(relationType);

    if (loading) {
        return <p>{text.loading}</p>;
    }

    return (
        <Card className="bg-tertiary-black border-none p-2">
            <div className="grid grid-cols-2 gap-4">
                {Array.isArray(relations) && relations.length > 0 ? (
                    relations.map((relation: Relation) => (
                        <ProfileRelationCard
                            key={relation.friendshipId}
                            friendshipId={relation.friendshipId}
                            friend={relation.friend}
                            relationType={relationType}
                        />
                    ))
                ) : (
                    <p>{text.empty}</p>
                )}
            </div>
        </Card>
    );
});

ProfileRelationList.displayName = 'ProfileRelationList';

export default ProfileRelationList;