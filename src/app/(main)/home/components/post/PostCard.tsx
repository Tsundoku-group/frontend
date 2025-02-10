import {Heart, Send, User} from "lucide-react";
import PostDate from "@/app/(main)/home/components/post/PostDate";
import CommentSection from "@/app/(main)/home/components/comment/CommentSection";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Post {
    id: string;
    author: {
        name: string;
        username: string;
        avatar: string;
    };
    content: string;
    images: string[];
    likes: number;
    commentsCount: number;
    createdAt: string;
}

export default function PostCard({post}: { post: Post }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="bg-tertiary-black p-4 rounded-lg shadow-md w-full mb-6">
            <div className="flex items-center gap-4 ml-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-white font-semibold">{post.author.name} <span
                        className="text-gray-400">@{post.author.username}</span></div>
                    <PostDate date={post.createdAt}/>
                </div>
            </div>

            <div className="text-white mt-3 px-12 pb-6 text-sm">{post.content}</div>

            {Array.isArray(post.images) && post.images.length > 0 && (
                <div className="grid gap-2 mt-3 rounded-lg overflow-hidden"
                     style={{gridTemplateColumns: `repeat(${Math.min(post.images.length, 2)}, 1fr)`}}>
                    {post.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post image ${index}`}
                            className={`w-full object-cover rounded-lg ${
                                post.images.length === 1 ? "h-60" : "h-32"
                            }`}
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center mt-3 px-12 text-xs">
                <div className="flex items-center gap-1 text-gray-400">
                    <Heart className="w-4 h-4 text-red-400"/>
                    <span className="font-semibold">4</span>
                </div>

                <div className="text-gray-400">
                    {post.commentsCount} commentaires
                </div>
            </div>

            <div className="flex justify-center items-center border-t border-gray-800 mt-3 pt-3 space-x-16 text-sm">
                <button className="flex items-center gap-1 text-red-400 hover:text-red-500">
                    <Heart className="w-5 h-5"/> J’aime
                </button>
                <button
                    className="flex items-center gap-1 text-gray-400 hover:text-white"
                    onClick={() => setShowComments(!showComments)}
                >
                    Commenter
                </button>

                <button className="flex items-center gap-1 text-gray-400 hover:text-white">
                    <Send className="w-5 h-5"/> Partager
                </button>
            </div>

            {showComments && <CommentSection postId={post.id}/>}
        </div>
    );
}