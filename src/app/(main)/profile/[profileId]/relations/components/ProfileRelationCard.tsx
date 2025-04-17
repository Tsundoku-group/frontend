import React, {useEffect, useState} from "react";
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
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    fetchAddProfileFriend,
    fetchFollowProfile,
    fetchRemoveFriend,
    fetchUnfollowProfile,
} from "@/app/(main)/profile/[profileId]/actions";
import {ShowToast} from "@/components/ShowToast";
import {useProfileContext} from "@/context/profileContext";
import {getProfileImageUrl} from "@/utils/profileImageUtils";
import {useRouter} from "next/navigation";
import {useSocket} from "@/context/socketContext";

interface ProfileRelationCardProps {
    friendshipId: number | null;
    friend: {
        friendId: number;
        firstname: string;
        lastname: string;
        username: string;
        commonFriendsCount?: number;
    };
    relationType: "friends" | "followed" | "followers" | "suggestions";
    isOwnProfile: boolean;
}

const ProfileRelationCard = ({friendshipId, friend, relationType, isOwnProfile}: ProfileRelationCardProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [actionType, setActionType] = useState<"removeFriend" | "follow" | "unfollow" | "addFriend" | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string>("");
    const [relationState, setRelationState] = useState({
        isFriend: relationType === "friends",
        isFollow: relationType === "followed",
    });
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;
    const { socket } = useSocket();
    const router = useRouter();

    const handleViewProfile = () => {
        router.push(`/profile/${friend.friendId}`);
    }

    useEffect(() => {
        const fetchOtherProfileImages = async () => {
            const otherProfileImages = await getProfileImageUrl(friend.friendId);
            if (otherProfileImages.profile) {
                setProfileImageUrl(otherProfileImages.profile);
            }
        }

        fetchOtherProfileImages();
    }, [friend.friendId]);

    const handleAction = async () => {
        if (!profileId || !friend.friendId) return;

        setLoading(true);
        try {
            if (actionType === "removeFriend") {
                await fetchRemoveFriend(friendshipId, profileId, friend.friendId);
                setRelationState((prev) => ({...prev, isFriend: false}));
                ShowToast("default", "Ami supprimé avec succès");
            } else if (actionType === "follow") {
                await fetchFollowProfile(profileId, friend.friendId);
                setRelationState((prev) => ({...prev, isFollow: true}));
                if (socket) {
                    socket.emit("sendNotification", {
                        receiverId: friend.friendId,
                        actorId: profileId,
                        actorFirstName: activeProfileInStorage?.firstName,
                        notificationType: "follow",
                        resourceType: "FOLLOW",
                        resourceId: friend.friendId,
                        createdAt: new Date().toISOString(),
                    });
                }
                ShowToast("default", "Utilisateur suivi avec succès");
            } else if (actionType === "unfollow") {
                await fetchUnfollowProfile(friendshipId, profileId, friend.friendId);
                setRelationState((prev) => ({...prev, isFollow: false}));
                ShowToast("default", "Utilisateur désabonné avec succès");
            } else if (actionType === "addFriend") {
                await handleAddFriend();
                setRelationState((prev) => ({...prev, isFriend: true}));
            }
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue lors de l'action", "Erreur");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    const handleAddFriend = async () => {
        const result = await fetchAddProfileFriend(profileId, friend.friendId);

        if (result?.status === "success") {
            ShowToast("default", result.message);
        } else if (result?.status === "pending") {
            ShowToast("destructive", result.message);
        } else if (result?.status === "rejected") {
            ShowToast("default", result.message);
        } else if (result?.status === "exists") {
            ShowToast("destructive", result.message);
        } else if (result?.status === "pendingForYou") {
            ShowToast("destructive", result.message);
        } else {
            ShowToast("destructive", result?.message ?? "Une erreur est survenue. Veuillez réessayer plus tard.", "Erreur");
        }
    };

    return (
        <>
            <Card className="w-full bg-secondary-black text-white border-none">
                <CardHeader className="grid grid-cols-3 items-center p-4">
                    <Avatar className="col-span-1 w-20 h-20">
                        <AvatarImage src={profileImageUrl} alt="Avatar"/>
                        <AvatarFallback className="bg-gray-600">
                            <User/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="col-span-2 text-sm">
                        <div className="font-semibold">{friend.lastname} {friend.firstname}</div>
                        <div className="text-sm text-gray-400">@{friend.username}</div>
                        {relationType === "suggestions" && friend.commonFriendsCount && isOwnProfile ? (
                            <div className="text-sm text-gray-400 mt-1">
                                {friend.commonFriendsCount} ami(e)(s) en commun
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <button onClick={handleViewProfile} className="text-primary text-sm hover:underline">Voir le
                        profil
                    </button>
                    <div className="flex space-x-2">
                        {["friends", "followers", "followed", "suggestions"].includes(relationType) && !relationState.isFriend ? (
                            <Button
                                className="text-primary text-sm hover:text-blue-700"
                                onClick={() => {
                                    setActionType("addFriend");
                                    setIsOpen(true);
                                }}
                            >
                                Ajouter en ami
                            </Button>
                        ) : null}

                        {relationType === "followers" && !relationState.isFollow ? (
                            <Button
                                className="text-blue-500 text-sm hover:text-blue-700"
                                onClick={() => {
                                    setActionType("follow");
                                    setIsOpen(true);
                                }}
                            >
                                Suivre
                            </Button>
                        ) : null}

                        {isOwnProfile && (
                            <>
                                {relationType === "friends" && relationState.isFriend ? (
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
                                ) : null}

                                {relationType === "followed" ? (
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
                                ) : null}
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {isOpen ? (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogOverlay/>
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
            ) : null}
        </>
    );
};

export default ProfileRelationCard;