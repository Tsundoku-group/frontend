import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User, ZoomIn} from "lucide-react";
import Image from "next/image";
import React from "react";

const ProfileAvatarWithDialog = ({ profileImageUrl, username }: { profileImageUrl?: string; username?: string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <div className="relative group cursor-pointer w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center">
                <Avatar className="w-28 h-28 border-white rounded-full">
                    <AvatarImage src={profileImageUrl} alt={username || "Profile"} className="object-cover object-center" />
                    <AvatarFallback>
                        <User className="w-6 h-6 text-gray-500" />
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <ZoomIn className="text-white" />
                </div>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Photo de profil</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
                <Image
                    src={profileImageUrl || ""}
                    alt="Photo de profil"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
            </div>
        </DialogContent>
    </Dialog>
);

export default ProfileAvatarWithDialog;