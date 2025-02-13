"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/app/(main)/home/actions";
import PostCard from "@/app/(main)/home/components/post/PostCard";
import InfiniteFeed from "./InfiniteFeed";
import {Skeleton} from "@/components/ui/skeleton";

export default function Feed() {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["recentPosts"],
        queryFn: async () => {
            return await fetchRecentPosts();
        },
        staleTime: 60000,
    });

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className=" p-4 rounded-lg shadow-md w-full">
                        <div className="flex items-center space-x-4 mb-3">
                            <Skeleton className="h-12 w-12 rounded-full bg-gray-500"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px] bg-gray-500"/>
                                <Skeleton className="h-4 w-[200px] bg-gray-500"/>
                            </div>
                        </div>
                        <div className="h-32 w-full rounded-lg"/>

                        <div className="h-6 w-full mt-4  rounded-lg"/>
                    </div>
                ))}
            </div>
        );
    }
    if (error) return <p className="text-center text-red-400">Erreur lors du chargement.</p>;

    return (
        <div className="w-full mx-auto">
            {posts && posts.length > 0 ? (
                posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                ))
            ) : (
                <p className="text-center text-gray-500">Aucun post à afficher.</p>
            )}
            <InfiniteFeed />
        </div>
    );
}