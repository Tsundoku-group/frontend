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

export default function Feed({ groupId }: Props) {
    const queryClient = useQueryClient();
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const { data, isLoading, error } = useQuery({
        queryKey: ["recentPosts", groupId, profileId],
        queryFn: () => fetchRecentPosts(groupId, profileId),
        staleTime: 60000,
        enabled: !!profileId,
    });

    const handleDeletePost = (postId: number) => {
        queryClient.setQueryData(["recentPosts", groupId, profileId], (oldData: any) => {
            if (!oldData || !oldData.posts) return { ...oldData, posts: [] };
            return {
                ...oldData,
                posts: oldData.posts.filter((post: any) => post.id !== postId),
            };
        });
    };

    if (isLoading) {
        return <FeedSkeleton />;
    }

    if (error || !data?.success) {
        return <p className="text-center text-red-400">Erreur lors du chargement.</p>;
    }

    return (
        <div className="w-full mx-auto">
            {data.posts && data.posts.length > 0 ? (
                data.posts.map((post: any) => (
                    <PostCard key={post.id} post={post} groupId={groupId} onDelete={handleDeletePost} />
                ))
            ) : (
                <p className="text-center text-gray-500">Aucun post à afficher.</p>
            )}
            <InfiniteFeed groupId={groupId} />
        </div>
    );
}
