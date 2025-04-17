"use client";

import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {fetchOlderPosts} from "@/server-actions/main/home/actions";
import PostCard from "@/components/post/post/PostCard";
import {useEffect, useRef} from "react";
import {useProfileContext} from "@/context/profileContext";

interface Props {
    groupId: number;
}

export default function InfiniteFeed({groupId}: Props) {
    const queryClient = useQueryClient();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["olderPosts"],
        queryFn: ({pageParam = 1}) => fetchOlderPosts(pageParam, 20, groupId, profileId),
        getNextPageParam: (lastPage) => {
            return lastPage?.nextPage ?? null;
        },
        initialPageParam: 1,
        staleTime: 60 * 1000,
    });

    const handleDeletePost = (postId: number) => {
        queryClient.setQueryData(["olderPosts"], (oldData: any) => {
            return oldData ? oldData.filter((post: any) => post.id !== postId) : [];
        });
    };

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
            }
        }, {rootMargin: "600px"});

        if (lastPostRef.current) observer.observe(lastPostRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page.posts) || [];
    const lastPostRef = useRef(null);

    return (
        <div className="w-full">
            {posts.map((post, index) => (
                <div ref={index === posts.length - 1 ? lastPostRef : null} key={`${post.id}-${index}`}>
                    <PostCard key={post.id} post={post} groupId={groupId} onDelete={handleDeletePost}/>
                </div>
            ))}

            {isFetchingNextPage && <p className="text-center text-gray-400">Chargement...</p>}
        </div>
    );
}