"use client";

import {useQuery} from "@tanstack/react-query";
import {fetchLastCommentsFromPost} from "@/app/(main)/home/actions";
import {CornerDownRight, Heart, Send, User} from "lucide-react";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import RepliesSection from "@/app/(main)/home/components/RepliesSection";
import {useProfileContext} from "@/context/profileContext";

interface CommentSectionProps {
    postId: number;
}

export default function CommentSection({postId}: CommentSectionProps) {
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const {data, isLoading} = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchLastCommentsFromPost(postId, profileId as number),
        staleTime: 1000 * 60 * 5,
    });

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});

    const comments = Array.isArray(data?.comments) ? data.comments : [];

    const handleReplySubmit = (commentId: string) => {
        console.log(`Réponse envoyée pour le commentaire ${commentId}:`, replyContent);
        setReplyContent("");
        setReplyingTo(null);
    };

    return (
        <div className="mt-3 border-t border-gray-700 pt-3">
            {isLoading ? (
                <p className="text-gray-400 text-sm">Chargement des commentaires...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 items-start text-sm">
                            <Avatar className="w-8 h-8">
                                <AvatarImage/>
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <div className="bg-primary-black p-2 rounded-lg">
                                    <p className="text-white font-semibold"></p>
                                    <p className="text-gray-300">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-2">
                                    <button className="flex items-center gap-1 hover:text-red-400">
                                        <Heart className="w-4 h-4"/> J’aime
                                    </button>
                                    <button
                                        className="flex items-center gap-1 hover:text-white"
                                        onClick={() =>
                                            setReplyingTo(replyingTo === comment.id ? null : comment.id)
                                        }
                                    >
                                        <CornerDownRight className="w-4 h-4"/> Répondre
                                    </button>
                                </div>

                                {replyingTo === comment.id && (
                                    <div className="mt-3 flex items-center gap-2 ml-8">
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            placeholder="Écrire une réponse..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                            onClick={() => handleReplySubmit(comment.id)}
                                        >
                                            <Send className="w-4 h-4"/>
                                        </button>
                                    </div>
                                )}

                                {comment.replyCount > 0 && (
                                    <button
                                        className="text-blue-400 text-xs mt-1 ml-3 hover:underline"
                                        onClick={() =>
                                            setOpenReplies(prev => ({...prev, [comment.id]: !prev[comment.id]}))
                                        }
                                    >
                                        {openReplies[comment.id] ? "Masquer les réponses" : `Voir réponses (${comment.replyCount})`}
                                    </button>
                                )}

                                {openReplies[comment.id] && (
                                    <RepliesSection
                                        postId={postId}
                                        commentId={comment.id}
                                        comment={{
                                            author: { id: comment.author.id },
                                            hasLiked: comment.hasLiked
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm">Aucun commentaire pour l’instant.</p>
            )}
        </div>
    );
}