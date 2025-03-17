import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {joinPrivateGroup} from "@/app/(main)/(groups)/clubs/actions";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";

interface GroupCardProps {
    group: {
        id: string;
        name: string;
        description: string;
        membersCount: number;
        visibility: string;
        imageUrl: string;
        joinStatus: "none" | "pending" | "member";
    };
}

export default function GroupCard({ group }: GroupCardProps) {
    const [status, setStatus] = useState(group.joinStatus);

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

    return (
        <Card className="rounded-lg overflow-hidden bg-secondary-black">
            <img src={group.imageUrl} alt={group.name} className="w-full h-32 object-cover" />
            <CardHeader>
                <CardTitle className="text-text-white">{group.name}</CardTitle>
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