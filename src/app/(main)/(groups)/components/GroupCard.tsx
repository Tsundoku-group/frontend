import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {joinPrivateGroup, toggleFavoriteGroup, togglePinnedGroup} from "@/app/(main)/(groups)/clubs/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import MarkActions from "@/components/MarkActions";
import {GroupData} from "@/models/GroupData";

interface GroupCardProps {
    group: GroupData;
}

export default function GroupCard({ group }: GroupCardProps) {
    const [status, setStatus] = useState(group.joinStatus);
    const [favorite, setFavorite] = useState(group.isFavorite);
    const [pinned, setPinned] = useState(group.isPinned);

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;

    const handleJoinRequest = async () => {
        if (!profileId) return;

        try {
            const result = await joinPrivateGroup(group.id, profileId, "member");

            if (result.error) {
                ShowToast("destructive", result.error, "Erreur");
            } else if (result.data) {
                setStatus("pending");
                ShowToast("default", "Votre demande a bien été envoyée");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!profileId) return;
        try {
            const result = await toggleFavoriteGroup(group.id, profileId, !favorite);
            if (result.error) {
                ShowToast("destructive", result.error, "Erreur");
            } else {
                setFavorite(!favorite);
                ShowToast("default", !favorite ? "Ajouté aux favoris" : "Favori retiré");
            }
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue. Veuillez réessayer ultérieurement.", "Erreur")
        }
    };

    const handleTogglePinned = async () => {
        if (!profileId) return;
        try {
            const result = await togglePinnedGroup(group.id, profileId, !pinned);
            if (result.error) {
                ShowToast("destructive", result.error, "Erreur");
            } else {
                setPinned(!pinned);
                ShowToast("default", !pinned ? "Épinglé" : "Désépinglé");
            }
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue. Veuillez réessayer ultérieurement.", "Erreur")
        }
    };

    return (
        <Card className="rounded-lg overflow-hidden bg-secondary-black">
            <img src={group.imageUrl} alt={group.name} className="w-full h-32 object-cover" />
            <CardHeader>
                <CardTitle className="text-text-white">{group.name}</CardTitle>
                {status === "member" && (
                    <MarkActions
                        showFavorite={true}
                        showPinned={true}
                        showRating={false}
                        initialFavorite={favorite}
                        initialPinned={pinned}
                        onToggleFavorite={handleToggleFavorite}
                        onTogglePinned={handleTogglePinned}
                    />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-gray-400 text-sm">{group.description}</div>
                <div className="text-gray-500 text-xs">👥 {group.membersCount} membres</div>
                <div className="text-gray-500 text-sm">{group.visibility}</div>

                {status === "none" && (
                    <Button onClick={handleJoinRequest} className="w-full mt-3">
                        🔑 Demander à rejoindre
                    </Button>
                )}

                {status === "pending" && (
                    <Button disabled className="w-full mt-3 bg-gray-600">
                        ⏳ Demande en attente...
                    </Button>
                )}

                {status === "member" && (
                    <Button className="w-full mt-3 bg-green-500">
                        ✅ Voir le groupe
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}