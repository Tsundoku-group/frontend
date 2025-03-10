import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GroupCardProps {
    group: {
        id: string;
        name: string;
        description: string;
        members: number;
        imageUrl: string;
        status: "joinable" | "pending" | "member";
    };
}

export default function GroupCard({ group }: GroupCardProps) {
    const [status, setStatus] = useState(group.status);

    const handleJoinRequest = () => {
        setStatus("pending");
    };

    return (
        <Card className="rounded-lg overflow-hidden bg-secondary-black">
            <img src={group.imageUrl} alt={group.name} className="w-full h-32 object-cover" />
            <CardHeader>
                <CardTitle className="text-text-white">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400 text-sm">{group.description}</p>
                <p className="text-gray-500 text-xs">👥 {group.members} membres</p>

                {status === "joinable" && (
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