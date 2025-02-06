"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRepliesForComment } from "@/app/(main)/home/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
        <div className="mt-2 border-l-2 border-gray-700">
            {isLoading ? (
                <p className="text-gray-400 text-xs">Chargement des réponses...</p>
            ) : replies.length > 0 ? (
                <div className="space-y-4">
                    {replies.map((reply: any, index) => (
                        <div key={reply.id} className="relative flex items-start text-xs pl-6">
                            <span className="absolute left-2.5 bottom-4 w-2 border-t-2 border-gray-700 before:content-[''] before:absolute before:w-3 before:h-3 before:-left-3 before:bottom-0 before:border-l-2 before:border-b-2 before:rounded-bl-md before:border-gray-700"></span>
                            <div className="relative">
                                <Avatar className="w-8 h-8 rounded-full bg-secondary-black">
                                    <AvatarImage />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="bg-secondary-black p-2 rounded-lg ml-2 w-full">
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