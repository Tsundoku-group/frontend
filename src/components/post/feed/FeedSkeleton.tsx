import { Skeleton } from "@/components/ui/skeleton";

export default function FeedSkeleton() {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg shadow-md w-full">
                    <div className="flex items-center space-x-4 mb-3">
                        <Skeleton className="h-12 w-12 rounded-full bg-gray-500" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px] bg-gray-500" />
                            <Skeleton className="h-4 w-[200px] bg-gray-500" />
                        </div>
                    </div>
                    <div className="h-32 w-full rounded-lg" />
                    <div className="h-6 w-full mt-4 rounded-lg" />
                </div>
            ))}
        </div>
    );
}