"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/app/(main)/home/actions";
import PostCard from "@/components/post/post/PostCard";
import InfiniteFeed from "./InfiniteFeed";
import FeedSkeleton from "@/components/post/feed/FeedSkeleton";
import { useProfileContext } from "@/context/profileContext";

export default function Feed() {
    const queryClient = useQueryClient();
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["recentPosts"],
        queryFn: async () => await fetchRecentPosts(profileId as number),
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
                    <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))
            ) : (
                <p className="text-center text-gray-500">Aucun post à afficher.</p>
            )}
            <InfiniteFeed />
        </div>
    );
}