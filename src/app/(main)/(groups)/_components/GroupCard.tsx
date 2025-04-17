import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {joinPrivateGroup, toggleFavoriteGroup, togglePinnedGroup} from "@/server-actions/main/groups/clubs/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import MarkActions from "@/components/MarkActions";
import {GroupData} from "@/models/GroupData";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {UsersRound, Lock, LockOpen, ContactRound} from "lucide-react";
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

            if (result.error) {
                ShowToast("destructive", result.error, "Erreur");
            } else if (result.data) {
                setStatus("pending");
                ShowToast("default", "Votre demande a bien été envoyée");
            }
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue. Veuillez réessayer ultérieurement.", "Erreur")
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
        <Card className="rounded-lg overflow-hidden bg-secondary-black pt-2">
            <div className="flex items-start gap-4 p-4">
                <Avatar className="w-12 h-12 shrink-0">
                    <AvatarImage src={group?.imageUrl}/>
                    <AvatarFallback>
                        <UsersRound/>
                    </AvatarFallback>
                </Avatar>
                <CardHeader className="p-0">
                    <CardTitle className="text-text-white text-sm">{group.name}</CardTitle>
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
            </div>
            <CardContent>
                <div className="text-gray-400 text-sm">{group.description}</div>

                <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    <ContactRound className="w-4 h-4"/>
                    {group.membersCount} membres
                </div>

                <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    {group.visibility === "private" ? (
                        <Lock className="w-4 h-4"/>
                    ) : (
                        <LockOpen className="w-4 h-4"/>
                    )}
                    <span className="capitalize">{group.visibility}</span>
                </div>

                {group.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {group.tags.map((tag: Tag) => (
                            <Badge
                                key={tag.slug}
                                className="text-xs font-medium px-3 py-1"
                            >
                              {tag.parent ? `${tag.name}` : tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
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
                    <Button
                        className="w-full mt-3 bg-green-highlight"
                        onClick={() => router.push(`/clubs/${group.slug}`)}
                    >
                        ✅ Voir le groupe
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}