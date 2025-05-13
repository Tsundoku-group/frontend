"use client";

import React, {useState} from "react";
import {Smile, FileImage, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {createNewPost} from "@/server-actions/main/home/actions";
import {PostData} from "@/models/PostData";
import {useProfileContext} from "@/context/profileContext";
import {ShowToast} from "@/components/ShowToast";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSocket} from "@/context/socketContext";

export default function CreatePost({ groupId, profileImageUrl }: { groupId: number, profileImageUrl: string }) {
    const [content, setContent] = useState("");
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;
    const { socket } = useSocket();

    const queryClient = useQueryClient();

    const { mutate: addPost } = useMutation({
        mutationFn: async (postData: PostData) => {
            return createNewPost(postData);
        },
        onSuccess: async (newPost) => {

            if (!newPost) {
                ShowToast("destructive", "Erreur : le post est vide ou incorrect", "Erreur");
                return;
            }

            const hydratedPost = {
                id: newPost.data.postId,
                content,
                createdAt: new Date().toISOString(),
                author: {
                    firstname: activeProfileInStorage?.firstName || '',
                    lastname: activeProfileInStorage?.lastName || '',
                    username: activeProfileInStorage?.username || '',
                },
                groupId,
                replyCount: 0,
                hasLiked: false,
                type: "post",
                visibility: groupId === 1 ? "public" : "private",
            };

            setContent("");

            if (socket) {
                socket.emit("new_post", { groupId, post: hydratedPost });
            }

            await queryClient.invalidateQueries({ queryKey: ["recentPosts"] });
            ShowToast("default", "Post ajouté avec succès !");
        },
        onError: () => {
            ShowToast("destructive", "Une erreur est survenue !", "Erreur");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (!profileId) return;

        const visibility = groupId === 1 ? "public" : "private";

        const postData: PostData = {
            title: "",
            content: content,
            authorId: profileId,
            groupId: groupId,
            visibility,
            type: 'post'
        };

        addPost(postData);
    };

    return (
        <div className="p-6 rounded-2xl shadow-lg w-full mb-6 border-secondary-black border"
             style={{
                 background: "linear-gradient(to right, #372048 1%, #1a1a2e 25%)",
             }}
        >
            <div className="flex items-center gap-6 w-full mb-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage
                        src={profileImageUrl}
                        alt={activeProfileInStorage?.username || "Profile Image"}
                        className="object-cover object-center"
                    />
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                <textarea
                    className="flex-1 h-14 bg-tertiary-black text-text-white placeholder-text-white px-4 py-4 rounded-2xl resize-none border-none focus:outline-none"
                    placeholder="Partage-nous tes dernières lectures !"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="flex justify-end items-center gap-x-6 w-full">
                <div className="flex gap-3">
                    <Button
                        className="flex items-center gap-2 text-green-400 bg-transparent border-2 border-tertiary-black px-6  rounded-full transition duration-300 hover:bg-green-400 hover:text-black">
                        <FileImage  className="w-5 h-5 font-extralight"/> Médias
                    </Button>

                    <Button
                        className="flex items-center gap-2 text-purple-400 bg-transparent border-2 border-tertiary-black px-6 rounded-full transition duration-300 hover:bg-purple-400 hover:text-black">
                        <FileImage className="w-5 h-5"/> GIF
                    </Button>

                    <Button
                        className="flex items-center gap-2 text-yellow-400 bg-transparent border-2 border-tertiary-black px-6 rounded-full transition duration-300 hover:bg-yellow-400 hover:text-black">
                        <Smile className="w-5 h-5"/> Émojis
                    </Button>
                </div>

                <Button
                    className={`px-12 py-2 rounded-3xl text-white font-light ${
                        content.trim()
                            ? "bg-purple-highlight hover:bg-purple-highlight"
                            : "bg-purple-highlight cursor-not-allowed"
                    }`}
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                >
                    Poster
                </Button>
            </div>
        </div>
    );
}