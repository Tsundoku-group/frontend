"use client";

import {useQuery} from "@tanstack/react-query";
import {createCommentOnPost, fetchLastCommentsFromPost} from "@/app/(main)/home/actions";
import {CornerDownRight, Heart, Send, User} from "lucide-react";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import RepliesSection from "@/app/(main)/home/components/RepliesSection";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({postId}: CommentSectionProps) {
    const {data, isLoading} = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchLastCommentsFromPost(postId),
        staleTime: 1000 * 60 * 5,
    });

    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const [commentContent, setCommentContent] = useState("");
    const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});

    const comments = Array.isArray(data?.comments) ? data.comments : [];

    const handlePostComment = async () => {
        if (!profileId || !commentContent.trim()) return;

        try {
            await createCommentOnPost({
                postId,
                authorId: profileId,
                content: commentContent,
            });

            setCommentContent("");
            ShowToast("default", "Commentaire ajouté !");
        } catch (error) {
            ShowToast("destructive", "Une erreur est survenue ! Veuillez réessayer.", "Erreur");
        }
    };

    return (
        <div className="mt-3 border-t border-gray-700 pt-3">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={activeProfileInStorage?.profileImageUrl || ""}/>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Ajouter un commentaire..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                />
                <Button className="bg-purple-highlight text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        onClick={handlePostComment}>
                    <Send className="w-4 h-4"/>
                </Button>
            </div>

            {isLoading ? (
                <p className="text-gray-400 text-sm">Chargement des commentaires...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 items-start text-sm">
                            <Avatar className="w-8 h-8 mt-4">
                                <AvatarImage/>
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <div className="bg-primary-black p-2 rounded-lg">
                                    <div
                                        className="text-white font-semibold ">{comment.author?.firstname}{comment.author?.lastname}</div>
                                    <div className="text-gray-300">{comment.content}</div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-2">
                                    <button className="flex items-center gap-1 hover:text-red-400">
                                        <Heart className="w-4 h-4"/> J’aime
                                    </button>
                                    <button
                                        className="flex items-center gap-1 hover:text-white"
                                        onClick={() =>
                                            setOpenReplies(prev => ({...prev, [comment.id]: !prev[comment.id]}))
                                        }
                                    >
                                        <CornerDownRight className="w-4 h-4"/> Répondre
                                    </button>
                                </div>

                                {openReplies[comment.id] && (
                                    <RepliesSection commentId={comment.id} postId={postId}/>
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