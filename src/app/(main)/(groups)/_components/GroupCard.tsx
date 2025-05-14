import {Card, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {joinPrivateGroup, toggleFavoriteGroup, togglePinnedGroup} from "@/server-actions/main/groups/clubs/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import MarkActions from "@/components/MarkActions";
import {GroupData} from "@/models/GroupData";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UsersRound, Lock, LockOpen} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tag} from "@/models/Tag";
import {useRouter} from "next/navigation";

interface GroupCardProps {
    group: GroupData;
}

export default function GroupCard({group}: GroupCardProps) {
    const [status, setStatus] = useState(group.joinStatus);
    const [favorite, setFavorite] = useState(group.isFavorite);
    const [pinned, setPinned] = useState(group.isPinned);
    const router = useRouter();

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const handleJoinRequest = async () => {
        if (!profileId) return;

        try {
            const result = await joinPrivateGroup(group.id, profileId, "member");

            if (!result.success) {
                ShowToast("destructive", result.message, "Erreur");
            } else {
                setStatus("pending");
                ShowToast("default", "Votre demande a bien été envoyée");
            }
        } catch (error) {
            ShowToast(
                "destructive",
                "Une erreur est survenue. Veuillez réessayer ultérieurement.",
                "Erreur"
            );
        }
    };

    const handleToggleFavorite = async () => {
        if (!profileId) return;
        try {
            const result = await toggleFavoriteGroup(group.id, profileId, !favorite);
            if (!result.success) {
                ShowToast("destructive", result.message, "Erreur");
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

            if (!result.success) {
                ShowToast("destructive", result.message, "Erreur");
                return;
            }

            setPinned(!pinned);
            ShowToast("default", !pinned ? "Épinglé" : "Désépinglé");
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue. Veuillez réessayer ultérieurement.", "Erreur");
        }
    };

    return (
        <Card
            className="rounded-xl bg-secondary-black border border-gray-700 shadow-md">
            <div className="flex items-start gap-4 p-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={group?.imageUrl}/>
                    <AvatarFallback>
                        <UsersRound className="text-gray-400"/>
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-text-white text-base font-semibold">{group.name}</CardTitle>
                        {status === "member" && (
                            <MarkActions
                                showFavorite
                                showPinned
                                showRating={false}
                                initialFavorite={favorite}
                                initialPinned={pinned}
                                onToggleFavorite={handleToggleFavorite}
                                onTogglePinned={handleTogglePinned}
                            />
                        )}
                    </div>

                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{group.description}</p>

                    <div className="flex items-center text-gray-500 text-xs mt-2 gap-4">
                        <span className="flex items-center gap-1">
                          <UsersRound className="w-4 h-4"/>
                            {group.membersCount} membres
                        </span>
                        <span className="flex items-center gap-1">
                                {group.visibility === "private" ?
                                    <Lock className="w-4 h-4"/> :
                                    <LockOpen className="w-4 h-4"/>
                                }
                            {group.visibility}
                        </span>
                    </div>

                    {group.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {group.tags.map((tag: Tag) => (
                                <Badge
                                    key={tag.slug}
                                    className="bg-[#2c2c34] text-gray-200 text-[11px] px-3 py-0.5 rounded-full"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        {status === "none" && (
                            <Button onClick={handleJoinRequest} className="w-full">
                                🔑 Demander à rejoindre
                            </Button>
                        )}

                        {status === "pending" && (
                            <Button disabled className="w-full bg-gray-600">
                                ⏳ Demande en attente...
                            </Button>
                        )}

                        {status === "member" && (
                            <Button
                                className="w-64 bg-green-highlight hover:bg-green-500 transition"
                                onClick={() => router.push(`/clubs/${group.slug}`)}
                            >
                                ✅ Voir le groupe
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}