"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/server-actions/main/home/actions";
import PostCard from "@/components/post/post/PostCard";
import InfiniteFeed from "./InfiniteFeed";
import FeedSkeleton from "@/components/post/feed/FeedSkeleton";
import { useProfileContext } from "@/context/profileContext";

interface Props {
    groupId: number;
}

export default function Feed({groupId}: Props) {
    const queryClient = useQueryClient();
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["recentPosts", groupId, profileId],
        queryFn: async () => await fetchRecentPosts(groupId, profileId),
        staleTime: 60000,
        enabled: !!profileId,
    });

    const handleDeletePost = (postId: number) => {
        queryClient.setQueryData(["recentPosts"], (oldData: any) =>
            oldData ? oldData.filter((post: any) => post.id !== postId) : []
        );
    };
    
    if (isLoading) {
        return <FeedSkeleton />;
    }

    if (error) {
        return <p className="text-center text-red-400">Erreur lors du chargement.</p>;
    }

    return (
        <div className="w-full mx-auto">
            {posts && posts.length > 0 ? (
                posts.map((post: any) => (
                    <PostCard key={post.id} post={post} groupId={groupId} onDelete={handleDeletePost} />
                ))
            ) : (
                <p className="text-center text-gray-500">Aucun post à afficher.</p>
            )}
            <InfiniteFeed groupId={groupId} />
        </div>
    );
}