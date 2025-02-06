"use client";

import {useQuery} from "@tanstack/react-query";
import {fetchLastCommentsFromPost} from "@/app/(main)/home/actions";
import {CornerDownRight, Heart} from "lucide-react";

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({postId}: CommentSectionProps) {
    const {data, isLoading} = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchLastCommentsFromPost(postId),
        staleTime: 1000 * 60 * 5,
    });

    const comments = Array.isArray(data?.comments) ? data.comments : [];

    return (
        <div className="mt-3 border-t border-gray-700 pt-3">
            {isLoading ? (
                <p className="text-gray-400 text-sm">Chargement des commentaires...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 items-start text-sm">
                            <img src="" alt="" className="w-8 h-8 rounded-full object-cover"/>
                            <div>
                                <div className="bg-primary-black p-2 rounded-lg w-full">
                                    <p className="text-white font-semibold"></p>
                                    <p className="text-gray-300">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-2">
                                    <button className="flex items-center gap-1 hover:text-red-400">
                                        <Heart className="w-4 h-4"/> J’aime
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-white">
                                        <CornerDownRight className="w-4 h-4"/> Répondre
                                    </button>
                                </div>
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