import {Heart} from "lucide-react";
import {useState, useEffect} from "react";
import {likePost} from "@/app/(main)/home/actions";
import {ShowToast} from "@/components/ShowToast";

interface ReactionCommentButtonProps {
    commentId: number;
    profileId?: number;
    actorFirstName?: string;
    receiverId: number;
    resourceType: "POST" | "COMMENT";
    initialHasLiked: boolean;
}

export default function ReactionCommentButton({
                                                  commentId,
                                                  profileId,
                                                  receiverId,
                                                  resourceType,
                                                  initialHasLiked
                                              }: ReactionCommentButtonProps) {
    const [hasLiked, setHasLiked] = useState(initialHasLiked);

    useEffect(() => {
        setHasLiked(initialHasLiked);
    }, [initialHasLiked]);

    const handleLikeCommentToggle = async () => {
        if (!profileId) {
            return;
        }

        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        console.log('commentId :', commentId)
        try {
            await likePost(profileId, receiverId, resourceType, commentId, "LIKE");
        } catch (err) {
            setHasLiked(!newHasLiked);
            ShowToast("destructive", "Une erreur est survenue.", "Erreur");
        }
    };

    return (
        <button
            className="flex items-center gap-1 text-gray-400 hover:text-gray-500"
            onClick={() => handleLikeCommentToggle()}
        >
            <Heart
                className="w-4 h-4 "
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
            /> J’aime
        </button>
    );
}