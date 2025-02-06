"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRepliesForComment } from "@/app/(main)/home/actions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";

interface RepliesSectionProps {
    commentId: string;
}

export default function RepliesSection({ commentId }: RepliesSectionProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["replies", commentId],
        queryFn: () => fetchRepliesForComment(commentId),
        staleTime: 1000 * 60 * 5,
    });

    const replies = Array.isArray(data?.replies) ? data.replies : [];

    return (
        <div className="ml-10 mt-2 border-l-2 border-gray-700 pl-4">
            {isLoading ? (
                <p className="text-gray-400 text-xs">Chargement des réponses...</p>
            ) : replies.length > 0 ? (
                <div className="space-y-2">
                    {replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3 items-start text-xs">
                            <Avatar className="w-8 h-8 rounded-full">
                                <AvatarImage></AvatarImage>
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div className="bg-secondary-black p-2 rounded-lg">
                                <p className="text-white font-semibold"></p>
                                <p className="text-gray-300">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-xs">Aucune réponse pour ce commentaire.</p>
            )}
        </div>
    );
}