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
import {fetchRemoveFriend} from "@/app/(main)/profile/[profileId]/actions";
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
}

const ProfileRelationCard = ({friendshipId, friend}: ProfileRelationCardProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [localIsFriend, setLocalIsFriend] = useState<boolean>(true);
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const handleRemoveFriend = async () => {
        if (!profileId || !friend.friendId) return;

        setLoading(true);
        try {
            await fetchRemoveFriend(friendshipId, profileId, friend.friendId);
            setLocalIsFriend(false);
            setIsOpen(false);
            ShowToast("default", "Ami supprimé avec succès");
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue lors de la suppression", "Erreur");
        } finally {
            setIsOpen(false);
        }
    }

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
                        {!localIsFriend ? (
                            <Button className="text-primary text-sm hover:underline">Ajouter en ami</Button>
                        ) : (
                            <Button
                                className="text-green-500 text-sm flex items-center space-x-1 cursor-pointer hover:text-green-700"
                                onClick={() => setIsOpen(true)}
                            >
                                <span>Ami</span>
                                <Check className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogOverlay/>
                <AlertDialogContent className="bg-tertiary-black border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Voulez-vous vraiment supprimer cet ami ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement l&apos;amitié avec {friend.firstname} {friend.lastname}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsOpen(false)} className="text-gray-500">Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveFriend}
                            className="text-red-600"
                            disabled={loading}
                        >
                            {loading ? "Suppression en cours..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ProfileRelationCard;