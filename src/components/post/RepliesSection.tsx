"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {replyToComment, fetchRepliesForComment} from "@/server-actions/main/home/actions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {User} from "lucide-react";
import {useState, useEffect} from "react";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import PostDate from "@/components/post/post/PostDate";
import ReactionCommentButton from "@/components/post/ReactionCommentButton";
import SendFilled from "@/assets/icons/SendFilled";

interface RepliesSectionProps {
    postId: number;
    commentId: string;
    comment: {
        author: {
            id: number,
        },
        hasLiked: boolean;
    };
}

export default function RepliesSection({commentId, postId}: RepliesSectionProps) {
    const {data, isLoading} = useQuery({
        queryKey: ["replies", commentId],
        queryFn: () => fetchRepliesForComment(commentId, profileId as number),
        staleTime: 1000 * 60 * 5,
    });
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const queryClient = useQueryClient();

    const [replyContent, setReplyContent] = useState("");
    const [localReplies, setLocalReplies] = useState<Array<any>>([]);

    useEffect(() => {
        if (data?.replies) {
            setLocalReplies(data.replies);
        }
    }, [data]);

    const {mutate: addReply} = useMutation({
        mutationFn: async (replyData: { postId: number; parentId: string; authorId: number; content: string }) => {
            return replyToComment(replyData);
        },
        onSuccess: (savedReply) => {
            ShowToast("default", "Réponse ajoutée !");

            const enrichedReply = {
                ...savedReply,
                authorFirstName: activeProfileInStorage?.firstName,
                authorLastName: activeProfileInStorage?.lastName,
            };

            setLocalReplies((prev) => [enrichedReply, ...prev]);

            queryClient.setQueryData(["replies", commentId], (old: any) => ({
                replies: [enrichedReply, ...(old?.replies || [])],
            }));
        },
        onError: () => {
            ShowToast("destructive", "Erreur lors de l'ajout de la réponse", "Erreur");
        },
        onSettled: () => {
            void queryClient.invalidateQueries({queryKey: ["replies", commentId]});
        },
    });

    return (
        <div className="mt-3 ml-8">
            <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={activeProfileInStorage?.profileImageUrl || ""}/>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Écrire une réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button
                    className="bg-purple-highlight text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                        if (replyContent.trim()) {
                            addReply({
                                postId,
                                parentId: commentId,
                                authorId: profileId as number,
                                content: replyContent
                            });
                            setReplyContent("");
                        }
                    }}
                >
                    <SendFilled className="w-5 h-5"/>
                </Button>
            </div>

            {isLoading ? (
                <p className="text-gray-400 text-xs">Chargement des réponses...</p>
            ) : localReplies.length > 0 ? (
                <div className="space-y-3 mt-2 w-full">
                    {localReplies.toReversed().map((reply: any, index: number) => (
                        <div
                            key={reply.id ?? `temp-reply-${index}`}
                            className="flex flex-col text-xs w-full"
                        >
                            <div className="flex gap-2 w-full">
                                <Avatar className="w-8 h-8 flex-shrink-0 mt-4">
                                    <AvatarImage src={reply.author?.profileImageUrl || ""}/>
                                    <AvatarFallback><User/></AvatarFallback>
                                </Avatar>

                                <div className="bg-primary-black p-4 rounded-lg flex-1 w-full">
                                    <div className="text-white font-semibold">
                                        {reply?.authorFirstName} {reply?.authorLastName}
                                    </div>
                                    <div className="text-gray-300">{reply.content}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-12">
                                <ReactionCommentButton
                                    commentId={reply._id}
                                    profileId={profileId}
                                    receiverId={reply.authorId}
                                    resourceType={"COMMENT"}
                                    initialHasLiked={reply.hasLiked}
                                />
                                <PostDate date={reply.createdAt}/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}