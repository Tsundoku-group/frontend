"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/server-actions/main/home/actions";
import PostCard from "@/components/post/post/PostCard";
import InfiniteFeed from "./InfiniteFeed";
import FeedSkeleton from "@/components/post/feed/FeedSkeleton";
import { useProfileContext } from "@/context/profileContext";
import {useEffect, useState} from "react";
import {useSocket} from "@/context/socketContext";

interface Props {
    groupId: number;
}

export default function Feed({ groupId }: Props) {
    const [newPostIds, setNewPostIds] = useState<number[]>([]);
    const queryClient = useQueryClient();
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;
    const {socket} = useSocket();

    const { data, isLoading, error } = useQuery({
        queryKey: ["recentPosts", groupId, profileId],
        queryFn: () => fetchRecentPosts(groupId, profileId),
        staleTime: 60000,
        enabled: !!profileId,
    });

    useEffect(() => {
        if (!socket) return;

        const handleNewPost = (post: any) => {
            queryClient.setQueryData(["recentPosts", groupId, profileId], (old: any) => {
                if (!old || !Array.isArray(old.posts)) return { posts: [post] };
                setNewPostIds((prev) => [post.id, ...prev]);
                setTimeout(() => {
                    setNewPostIds((prev) => prev.filter((id) => id !== post.id));
                }, 3000);

                return {
                    ...old,
                    posts: [post, ...old.posts],
                };
            });
        };

        socket.on(`new_post_group_${groupId}`, handleNewPost);

        return () => {
            socket.off(`new_post_group_${groupId}`, handleNewPost);
        };
    }, [socket, groupId, profileId]);

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
            <div className="text-text-white mb-4 mt-9">Fil d&apos;actualité</div>
            {Array.isArray(data.posts) && data.posts.length > 0 ? (
                <>
                    {data.posts.map((post: any) => (
                        <div
                            key={post.id}
                            className={`transition-all duration-500 ease-in-out transform ${
                                newPostIds.includes(post.id) ? 'opacity-0 translate-y-4 animate-fadeIn' : 'opacity-100'
                            }`}
                        >
                            <PostCard post={post} groupId={groupId} onDelete={handleDeletePost} />
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-center text-gray-500">Aucun post à afficher.</p>
            )}
            <InfiniteFeed groupId={groupId} />
        </div>
    );
}
