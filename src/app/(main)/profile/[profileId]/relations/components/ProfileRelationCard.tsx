import React, {useState} from "react";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    fetchAddProfileFriend,
    fetchFollowProfile,
    fetchRemoveFriend,
    fetchUnfollowProfile
} from "@/app/(main)/profile/[profileId]/actions";
import {ShowToast} from "@/components/ShowToast";
import {useProfileContext} from "@/context/profileContext";

interface ProfileRelationCardProps {
    friendshipId: string;
    friend: {
        friendId: string;
        firstname: string;
        lastname: string;
        username: string;
    };
    relationType: 'friends' | 'followed' | 'followers';
}

const ProfileRelationCard = ({friendshipId, friend, relationType}: ProfileRelationCardProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"removeFriend" | "follow" | "unfollow" | "addFriend" | null>(null);
    const [relationState, setRelationState] = useState({
        isFriend: relationType === 'friends',
        isFollow: relationType === 'followed',
    });
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const handleAction = async () => {
        if (!profileId || !friend.friendId) return;

        setLoading(true);
        try {
            if ("removeFriend" === actionType ) {
                await fetchRemoveFriend(friendshipId, profileId, friend.friendId);
                setRelationState((prev) => ({ ...prev, isFriend: false }));
                ShowToast("default", "Ami supprimé avec succès");
            } else if ("follow" === actionType) {
                await fetchFollowProfile(profileId, friend.friendId);
                setRelationState((prev) => ({ ...prev, isFollow: true }));
                ShowToast("default", "Utilisateur suivi avec succès");
            } else if ("unfollow" === actionType) {
                await fetchUnfollowProfile(friendshipId, profileId, friend.friendId);
                setRelationState((prev) => ({ ...prev, isFollow: false }));
                ShowToast("default", "Utilisateur désabonné avec succès");
            } else if ("addFriend" === actionType) {
                await fetchAddProfileFriend(profileId, friend.friendId);
                setRelationState((prev) => ({ ...prev, isFriend: true }));
                ShowToast("default", "Demande d'ami envoyée");
            }
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue lors de l'action", "Erreur");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <Card className="w-full bg-secondary-black text-white border-none">
                <CardHeader className="grid grid-cols-3 items-center p-4">
                    <Avatar className="col-span-1 w-20 h-20">
                        <AvatarImage src="your-avatar-url" alt="Avatar"/>
                        <AvatarFallback className="bg-gray-600">
                            <User/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="col-span-2 text-sm">
                        <div className="font-semibold">{friend.lastname} {friend.firstname}</div>
                        <div className="text-sm text-gray-400">@{friend.username}</div>
                    </div>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <button className="text-primary text-sm hover:underline">Voir le profil</button>
                    <div className="flex space-x-2">
                        {relationType === 'friends' && relationState.isFriend && (
                            <Button
                                className="text-green-500 text-sm flex items-center space-x-1 cursor-pointer hover:text-green-700"
                                onClick={() => {
                                    setActionType("removeFriend");
                                    setIsOpen(true);
                                }}
                            >
                                <span>Ami</span>
                                <Check className="w-4 h-4"/>
                            </Button>
                        )}

                        {'friends' === relationType || 'followed' === relationType || 'followers' === relationType? (
                            !relationState.isFriend && (
                                <Button
                                    className="text-primary text-sm hover:text-blue-700"
                                    onClick={() => {
                                        setActionType("addFriend");
                                        setIsOpen(true);
                                    }}
                                >
                                    Ajouter en ami
                                </Button>
                            )
                        ) : null}

                        {relationType === 'followers' && (
                            relationState.isFollow ? (
                                <Button
                                    className="text-green-500 text-sm flex items-center space-x-1 cursor-pointer hover:text-green-700"
                                    onClick={() => {
                                        setActionType("unfollow");
                                        setIsOpen(true);
                                    }}
                                >
                                    <span>Suivi</span>
                                    <Check className="w-4 h-4"/>
                                </Button>
                            ) : (
                                <Button
                                    className="text-blue-500 text-sm hover:text-blue-700"
                                    onClick={() => {
                                        setActionType("follow");
                                        setIsOpen(true);
                                    }}
                                >
                                    Suivre
                                </Button>
                            )
                        )}

                        {relationType === 'followed' && (
                            <Button
                                className="text-green-500 text-sm flex items-center space-x-1 cursor-pointer hover:text-green-700"
                                onClick={() => {
                                    setActionType("unfollow");
                                    setIsOpen(true);
                                }}
                            >
                                <span>Suivi</span>
                                <Check className="w-4 h-4"/>
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {isOpen && (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogOverlay />
                    <AlertDialogContent className="bg-tertiary-black border-none">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {actionType === "removeFriend"
                                    ? "Voulez-vous vraiment supprimer cet ami ?"
                                    : actionType === "unfollow"
                                        ? "Voulez-vous vraiment vous désabonner ?"
                                        : "Voulez-vous vraiment effectuer cette action ?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {actionType === "removeFriend"
                                    ? `Cette action supprimera définitivement l'amitié avec ${friend.firstname} ${friend.lastname}.`
                                    : actionType === "unfollow"
                                        ? `Cette action vous désabonnera de ${friend.firstname} ${friend.lastname}.`
                                        : `Cette action ajoutera ${friend.firstname} ${friend.lastname} à votre liste.`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500"
                            >
                                Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleAction}
                                className="text-blue-500"
                                disabled={loading}
                            >
                                {loading ? "Action en cours..." : "Confirmer"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
};

export default ProfileRelationCard;
