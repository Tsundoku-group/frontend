import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from 'next/image';

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
        <Card className="bg-secondary-black p-4 border-spacing-1 border-gray-600">
            <h2 className="text-text-white text-lg font-semibold flex items-center mb-4">
                <Users className="w-5 h-5 mr-2" /> Clubs ({clubs.length})
            </h2>
            <div className="space-y-4">
                {clubs.map((club, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <Image
                            src={club.avatar}
                            alt={club.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-text-white font-semibold">{club.name}</p>
                            <p className="text-gray-400 text-xs font-extralight">
                                {club.members} • {club.contacts}
                            </p>
                            <div className="flex items-center space-x-1 mt-2">
                                {club.contactImages.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        alt={`Contact ${i + 1}`}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ))}
                                {club.extraContacts && (
                                    <span className="text-text-muted text-sm">{club.extraContacts}</span>
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