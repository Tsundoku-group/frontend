import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import {Card} from "@/components/ui/card";
import {ChevronRight, User, Users} from "lucide-react";
import Image from 'next/image';
import {Button} from "@/components/ui/button";
import UsersFilled from "@/assets/icons/UsersFilled";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

const clubs = [
    {
        name: "Graines d'écrivains",
        members: "1028 membres",
        contacts: "9 contacts",
        avatar: "https://github.com/shadcn.png",
        contactImages: [
            "https://github.com/shadcn.png",
            "https://github.com/shadcn.png",
            "https://github.com/shadcn.png",
            "https://github.com/shadcn.png",
        ],
        extraContacts: "+4",
    },
    {
        name: "Les livres dont tu es le héros !",
        members: "33 800 membres",
        contacts: "2 contacts",
        avatar: "https://github.com/shadcn.png",
        contactImages: [
            "https://github.com/shadcn.png",
            "https://github.com/shadcn.png",
        ],
        extraContacts: null,
    },
];
const ClubsCard = () => {
    return (
        <Card className="bg-secondary-black p-8 pb-4 border-spacing-1 border-tertiary-black">
            <Button className="flex items-center justify-between w-full mb-6 bg-transparent hover:bg-tertiary-black">
                <div className="flex items-center text-text-white text-lg font-semibold">
                    <UsersFilled className="w-6 h-6 mr-2"/>
                    <span>Mes clubs</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-white"/>
            </Button>
            <div className="space-y-4">
                {clubs.map((club, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={club.avatar} alt={club.name}/>
                            <AvatarFallback>
                                <User/>
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-text-white font-medium">{club.name}</div>
                            <div className="text-gray-400 text-xs font-extralight">
                                {club.members} • {club.contacts}
                            </div>
                            <div className="flex items-center mt-2">
                                {club.contactImages.map((img, i) => (
                                    <Avatar
                                        key={i}
                                        className={cn(
                                            "w-6 h-6 ring-2 ring-black",
                                            i !== 0 && "-ml-3"
                                        )}
                                        style={{zIndex: club.contactImages.length - i}}
                                    >
                                        <AvatarImage src={img} alt={`Contact ${club.name}`}/>
                                        <AvatarFallback>
                                            <User/>
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {club.extraContacts && (
                                    <span className="text-text-white text-sm ml-2">{club.extraContacts}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex flex-col items-center">
                <ViewMoreButton/>
            </div>
        </Card>
    );
};

export default ClubsCard;