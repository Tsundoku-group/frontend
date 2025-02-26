import { useState } from "react";
import { Heart } from "lucide-react";
import { ShowToast } from "@/components/ShowToast";
import { likePost } from "@/app/(main)/home/actions";

interface ReactionButtonProps {
    postId: string;
    profileId?: string;
    receiverId: string;
    resourceType: "POST" | "COMMENT";
    initialHasLiked: boolean;
}

export default function ReactionButton({ postId, profileId, receiverId, resourceType, initialHasLiked }: ReactionButtonProps) {
    const [hasLiked, setHasLiked] = useState(initialHasLiked);

    const handleLikeToggle = async () => {
        if (!profileId) return;

        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);

        try {
            await likePost(profileId, receiverId, resourceType, postId, "LIKE");
        } catch (error) {
            setHasLiked(!newHasLiked);
            ShowToast("destructive", "Une erreur est survenue.", "Erreur");
        }
    };

    return (
        <button className="flex items-center gap-1 text-red-400 hover:text-red-500" onClick={handleLikeToggle}>
            <Heart
                className="w-5 h-5 transition-all duration-300"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
            /> J’aime
        </button>
    );
}