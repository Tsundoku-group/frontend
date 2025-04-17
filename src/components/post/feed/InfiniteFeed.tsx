"use client";

import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {fetchOlderPosts} from "@/app/(main)/home/actions";
import PostCard from "@/components/post/post/PostCard";
import {useEffect, useRef} from "react";
import {useProfileContext} from "@/context/profileContext";

export default function InfiniteFeed() {
    const queryClient = useQueryClient();
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["olderPosts"],
        queryFn: ({ pageParam = 1 }) => fetchOlderPosts(pageParam, 20, profileId as number),
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
        }, { rootMargin: "600px" });

        if (lastPostRef.current) observer.observe(lastPostRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page.posts) || [];
    const lastPostRef = useRef(null);

    return (
        <div className="w-full">
            {posts.map((post, index) => (
                <div ref={index === posts.length - 1 ? lastPostRef : null} key={`${post.id}-${index}`}>
                    <PostCard key={post.id} post={post} onDelete={handleDeletePost}/>
                </div>
            ))}

            {isFetchingNextPage && <p className="text-center text-gray-400">Chargement...</p>}
        </div>
    );
}