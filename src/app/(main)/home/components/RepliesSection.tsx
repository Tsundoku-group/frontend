"use client";

import { useQuery } from "@tanstack/react-query";
import { replyToComment, fetchRepliesForComment } from "@/app/(main)/home/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Send } from "lucide-react";
import { useState } from "react";
import { useProfileContext } from "@/context/profileContext";
import { ShowToast } from "@/components/ShowToast";

interface RepliesSectionProps {
    postId: string;
    commentId: string;
}

export default function RepliesSection({ commentId, postId }: RepliesSectionProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["replies", commentId],
        queryFn: () => fetchRepliesForComment(commentId),
        staleTime: 1000 * 60 * 5,
    });

    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const [replyContent, setReplyContent] = useState("");

    const replies = Array.isArray(data?.replies) ? data.replies : [];
    const handleReplySubmit = async () => {
        if (!profileId || !replyContent.trim()) return;

        try {
            await replyToComment({
                postId: postId,
                parentId: commentId,
                authorId: profileId,
                content: replyContent,
            });

            setReplyContent("");
            ShowToast("default", "Réponse ajoutée !");
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue ! Veuillez réessayer.", "Erreur");
        }
    };

    return (
        <div className="mt-3 ml-8">
            <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={activeProfileInStorage?.profileImageUrl || ""} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Écrire une réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button className="bg-purple-highlight text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        onClick={handleReplySubmit}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>

            {isLoading ? (
                <p className="text-gray-400 text-xs">Chargement des réponses...</p>
            ) : replies.length > 0 ? (
                <div className="space-y-3 mt-2">
                    {replies.map((reply: any) => (
                        <div key={reply.id} className="flex items-start gap-3 text-xs">
                            <Avatar className="w-6 h-6">
                                <AvatarImage />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div className="bg-secondary-black p-2 rounded-lg">
                                <p className="text-white font-semibold">{reply.author?.name}</p>
                                <p className="text-gray-300">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}