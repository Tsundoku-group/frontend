"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    createCommentOnPost,
    fetchLastCommentsFromPost,
    updateCommentOnPost,
    deleteCommentOnPost
} from "@/app/(main)/home/actions";
import {CornerDownRight, Heart, Send, User, EllipsisVertical, Pencil, Trash} from "lucide-react";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import RepliesSection from "@/app/(main)/home/components/RepliesSection";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {useSocket} from "@/context/socketContext";

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
    const queryClient = useQueryClient();
    const {socket} = useSocket();

    const [commentContent, setCommentContent] = useState("");
    const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});

    const comments = Array.isArray(data?.comments) ? data.comments : [];
    const {mutate: addComment} = useMutation({
        mutationFn: async (commentData: { postId: string; authorId: string; content: string }) => {
            return createCommentOnPost(commentData);
        },
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({queryKey: ["comments", postId]});
            const previousComments = queryClient.getQueryData(["comments", postId]);
            const tempComment = {
                id: `temp-${Date.now()}`,
                authorId: profileId,
                content: newComment.content,
                replyCount: 0,
            };

            if (socket) {
                socket.emit("sendNotification", {
                    receiverId: newComment.authorId,
                    actorId: profileId,
                    actorFirstName: activeProfileInStorage?.firstName,
                    notificationType: "comment",
                    resourceType: "POST",
                    resourceId: postId,
                    createdAt: new Date().toISOString(),
                });
            }
            queryClient.setQueryData(["comments", postId], (old: any) => {
                return old
                    ? {...old, comments: [tempComment, ...old.comments]}
                    : {comments: [tempComment]};
            });

            setCommentContent("");

            return {previousComments};
        },
        onSuccess: () => {
            ShowToast("default", "Commentaire ajouté !");
        },
        onError: (err, newComment, context) => {
            ShowToast("destructive", "Erreur lors de l'ajout du commentaire", "Erreur");

            if (context?.previousComments) {
                queryClient.setQueryData(["comments", postId], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["comments", postId]});
        },
    });

    const {mutate: editComment} = useMutation({
        mutationFn: async ({id, content}: { id: string; content: string }) => {
            return updateCommentOnPost(id, profileId, content);
        },
        onSuccess: () => {
            ShowToast("default", "Commentaire modifié !");
            queryClient.invalidateQueries({queryKey: ["comments", postId]});
            setEditingCommentId(null);
        },
        onError: () => {
            ShowToast("destructive", "Erreur lors de la modification", "Erreur");
        },
    });

    const {mutate: deleteComment} = useMutation({
        mutationFn: async (commentId: string) => {
            return deleteCommentOnPost(commentId, profileId as string);
        },
        onMutate: async (commentId: string) => {
            await queryClient.cancelQueries({queryKey: ["comments", postId]});
            const previousComments = queryClient.getQueryData(["comments", postId]);

            queryClient.setQueryData(["comments", postId], (old: any) => {
                return old
                    ? {...old, comments: old.comments.filter((c: any) => c.id !== commentId)}
                    : old;
            });

            return {previousComments};
        },
        onSuccess: () => {
            ShowToast("default", "Commentaire supprimé !");
        },
        onError: (err, commentId, context) => {
            ShowToast("destructive", "Erreur lors de la suppression", "Erreur");

            if (context?.previousComments) {
                queryClient.setQueryData(["comments", postId], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["comments", postId]});
        },
    });

    const handleEditComment = (commentId: string) => {
        if (!editedContent[commentId]?.trim()) return;
        editComment({id: commentId, content: editedContent[commentId]});
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
                        onClick={() => {
                            if (commentContent.trim()) {
                                addComment({postId, authorId: profileId as string, content: commentContent});
                            }
                        }}>
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
                                <div className="bg-primary-black p-2 rounded-lg flex justify-between">
                                    <div className="w-full flex items-start justify-between">
                                        <div className="bg-primary-black p-2 rounded-lg flex-1">
                                            <div className="text-white font-semibold">
                                                {comment.author?.firstname} {comment.author?.lastname}
                                            </div>
                                            {editingCommentId === comment.id ? (
                                                <textarea
                                                    className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none resize-none"
                                                    value={editedContent[comment.id] || comment.content}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            [comment.id]: e.target.value,
                                                        }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleEditComment(comment.id);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-gray-300">{comment.content}</div>
                                            )}
                                        </div>

                                        {editingCommentId === comment.id && (
                                            <div className="ml-3 flex flex-row gap-2 self-center items-center">
                                                <Button
                                                    className="bg-purple-highlight text-white px-2 py-1 rounded-md text-xs"
                                                    onClick={() => handleEditComment(comment.id)}
                                                >
                                                    Sauvegarder
                                                </Button>
                                                <Button
                                                    className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs"
                                                    onClick={() => setEditingCommentId(null)}
                                                >
                                                    Annuler
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical
                                                className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-primary-black border-none">
                                            {editingCommentId === comment.id ? (
                                                <DropdownMenuItem className="text-white"
                                                                  onClick={() => handleEditComment(comment.id)}>
                                                    Sauvegarder
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="text-white"
                                                                  onClick={() => setEditingCommentId(comment.id)}>
                                                    Modifier <Pencil className="h-4 w-4 ml-6"/>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-red-highlight"
                                                              onClick={() => deleteComment(comment.id)}>
                                                Supprimer <Trash className="h-4 w-4 ml-4"/>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                    {comment.replyCount > 0 && (
                                        <button
                                            className="flex items-center gap-1 text-blue-400 hover:text-blue-600"
                                            onClick={() =>
                                                setOpenReplies(prev => ({...prev, [comment.id]: !prev[comment.id]}))
                                            }
                                        >
                                            Voir les réponses ({comment.replyCount})
                                        </button>
                                    )}
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