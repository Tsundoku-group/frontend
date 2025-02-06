"use client";

import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchOlderPosts} from "@/app/(main)/home/actions";
import PostCard from "@/app/(main)/home/components/Post/PostCard";
import {useEffect, useRef} from "react";

export default function InfiniteFeed() {
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["olderPosts"],
        queryFn: ({pageParam = 1}) => fetchOlderPosts(pageParam, 20),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        initialPageParam: 1,
        staleTime: 60 * 1000,
    });

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
                    <PostCard post={post}/>
                </div>
            ))}

            {isFetchingNextPage && <p className="text-center text-gray-400">Chargement...</p>}
        </div>
    );
}