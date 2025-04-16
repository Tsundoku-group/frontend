"use client";

import React, { useState } from "react";
import { Image, Smile, FileImage, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createNewPost } from "@/app/(main)/home/actions";
import { PostData } from "@/models/PostData";
import { useProfileContext } from "@/context/profileContext";
import { ShowToast } from "@/components/ShowToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePost({ groupId }: { groupId: number }) {
    const [content, setContent] = useState("");
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;


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

            setContent("");
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

        const postData: PostData = {
            title: "",
            content: content,
            authorId: profileId,
            groupId: groupId,
            visibility: "public",
        };

        addPost(postData);
    };

    return (
        <div className="p-8 rounded-2xl shadow-lg w-full mb-6"
            style={{
                background: "linear-gradient(to right, #372048 1%, #1a1a2e 25%)",
            }}
        >
            <div className="flex items-center gap-6 w-full mb-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <textarea
                    className="flex-1 bg-primary-black text-white placeholder-gray-400 px-4 py-2 rounded-2xl resize-none border-none focus:outline-none"
                    placeholder="Partage-nous tes dernières lectures !"
                    rows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="flex justify-end items-center gap-x-6 w-full">
                <div className="flex gap-3">
                    <Button
                        className="flex items-center gap-2 text-green-400 bg-transparent border border-gray-700 px-6 py-2 rounded-full transition duration-300 hover:bg-green-400 hover:text-black">
                        <Image className="w-5 h-5" /> Médias
                    </Button>

                    <Button
                        className="flex items-center gap-2 text-purple-400 bg-transparent border border-gray-700 px-6 py-2 rounded-full transition duration-300 hover:bg-purple-400 hover:text-black">
                        <FileImage className="w-5 h-5" /> GIF
                    </Button>

                    <Button
                        className="flex items-center gap-2 text-yellow-400 bg-transparent border border-gray-700 px-6 py-2 rounded-full transition duration-300 hover:bg-yellow-400 hover:text-black">
                        <Smile className="w-5 h-5" /> Émojis
                    </Button>
                </div>

                <Button
                    className={`px-8 py-2 rounded-3xl text-white font-light ${content.trim()
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