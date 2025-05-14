import { useState } from "react";
import { Heart } from "lucide-react";
import { ShowToast } from "@/components/ShowToast";
import { likePost } from "@/server-actions/main/home/actions";
import { useSocket } from "@/context/socketContext";
import clsx from "clsx";

interface ReactionButtonProps {
    postId: number;
    profileId?: number;
    actorFirstName?: string;
    receiverId: number;
    resourceType: "POST" | "COMMENT";
    initialHasLiked: boolean;
}

export default function ReactionButton({
                                           postId,
                                           profileId,
                                           actorFirstName,
                                           receiverId,
                                           resourceType,
                                           initialHasLiked,
                                       }: ReactionButtonProps) {
    const [hasLiked, setHasLiked] = useState(initialHasLiked);
    const [isAnimating, setIsAnimating] = useState(false);
    const { socket } = useSocket();

    const handleLikeToggle = async () => {
        if (!profileId) return;

        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        setIsAnimating(true);

        setTimeout(() => setIsAnimating(false), 500);

        if (socket && newHasLiked) {
            socket.emit("sendNotification", {
                receiverId,
                actorId: profileId,
                actorFirstName,
                notificationType: "like",
                resourceType,
                resourceId: postId,
                createdAt: new Date().toISOString(),
            });
        }

        try {
            await likePost(profileId, receiverId, resourceType, postId, "LIKE");
        } catch (error) {
            setHasLiked(!newHasLiked);
            ShowToast("destructive", "Une erreur est survenue.", "Erreur");
        }
    };

    return (
        <button
            onClick={handleLikeToggle}
            className="relative flex items-center gap-1 text-red-400 hover:text-red-500"
        >
            {isAnimating && (
                <span className="absolute inset-0 flex items-center justify-center z-[-1]">
                    <span className="animate-ping-pulse w-6 h-6 rounded-full bg-red-400 opacity-50" />
                </span>
            )}
            <Heart
                className={clsx(
                    "w-5 h-5 transition-transform duration-300 mr-1",
                    {
                        "scale-125": isAnimating,
                        "fill-current": hasLiked,
                        "fill-none": !hasLiked,
                    }
                )}
                stroke="currentColor"
            />
            J’aime
        </button>
    );
}