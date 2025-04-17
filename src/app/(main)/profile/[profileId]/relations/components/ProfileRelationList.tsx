import React from "react";
import {Card} from "@/components/ui/card";
import ProfileRelationCard from "@/app/(main)/profile/[profileId]/relations/components/ProfileRelationCard";

interface Friend {
    friendId: number;
    firstname: string;
    lastname: string;
    username: string;
}

interface Suggestion {
    friend: {
        friendId: number;
        firstname: string;
        lastname: string;
        username: string;
        commonFriendsCount: number;
    }
}

interface Relation {
    friendshipId: number | null;
    friend: Friend;
}

interface ListProfileRelation {
    relations: Relation[] | Suggestion[];
    loading: boolean;
    relationType: 'friends' | 'followed' | 'followers' | 'suggestions';
    isOwnProfile: boolean;
}

const ProfileRelationList = React.memo(({relations, loading, relationType, isOwnProfile}: ListProfileRelation) => {
    const getText = (type: 'friends' | 'followed' | 'followers' | 'suggestions') => {
        switch (type) {
            case 'friends':
                return {loading: 'Chargement des amis...', empty: 'Aucun ami trouvé.'};
            case 'followed':
                return {loading: 'Chargement des utilisateurs suivis...', empty: 'Aucun utilisateur suivi trouvé.'};
            case 'followers':
                return {loading: 'Chargement des followers...', empty: 'Aucun follower trouvé.'};
            case 'suggestions':
                return {loading: 'Chargement des suggestions...', empty: 'Aucune suggestion trouvée.'};
            default:
                return {loading: 'Chargement...', empty: 'Aucun résultat trouvé.'};
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
                    relations.map((item) => {
                        if ('suggestions' === relationType) {
                            const suggestion = item as Suggestion;
                            return (
                                <ProfileRelationCard
                                    key={suggestion.friend.friendId}
                                    friendshipId={null}
                                    friend={{
                                        friendId: suggestion.friend.friendId,
                                        firstname: suggestion.friend.firstname,
                                        lastname: suggestion.friend.lastname,
                                        username: suggestion.friend.username,
                                        commonFriendsCount: suggestion.friend.commonFriendsCount
                                    }}
                                    relationType={relationType}
                                    isOwnProfile={isOwnProfile}
                                />
                            );
                        }

                        const relation = item as Relation;
                        return (
                            <ProfileRelationCard
                                key={relation.friendshipId}
                                friendshipId={relation.friendshipId}
                                friend={relation.friend}
                                relationType={relationType}
                                isOwnProfile={isOwnProfile}
                            />
                        );
                    })
                ) : (
                    <p>{text.empty}</p>
                )}
            </div>
        </Card>
    );
});

ProfileRelationList.displayName = 'ProfileRelationList';

export default ProfileRelationList;