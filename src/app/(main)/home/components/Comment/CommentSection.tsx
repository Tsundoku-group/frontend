"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareMore } from "lucide-react";
import { fetchLastCommentsFromPost } from "@/app/(main)/home/actions";

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const [showComments, setShowComments] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchLastCommentsFromPost(postId),
        enabled: showComments,
        staleTime: 1000 * 60 * 5,
    });

    const comments = Array.isArray(data?.comments) ? data.comments : [];

    return (
        <div className="mt-4">
            <button
                className="flex items-center gap-1 text-gray-400 hover:text-white"
                onClick={() => setShowComments(!showComments)}
            >
                <MessageSquareMore className="w-5 h-5"/> Commenter
            </button>

            {showComments && (
                <div className="mt-3 border-t border-gray-700 pt-3">
                    {isLoading ? (
                        <p className="text-gray-400 text-sm">Chargement des commentaires...</p>
                    ) : comments.length > 0 ? (
                        <div className="space-y-3">
                            {comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-3 items-start text-sm">
                                    <img src="" alt=""
                                         className="w-8 h-8 rounded-full object-cover"/>
                                    <div className="bg-gray-800 p-2 rounded-lg">
                                        <p className="text-white font-semibold">tg</p>
                                        <p className="text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Aucun commentaire pour l’instant.</p>
                    )}
                </div>
            )}
        </div>
    );
}