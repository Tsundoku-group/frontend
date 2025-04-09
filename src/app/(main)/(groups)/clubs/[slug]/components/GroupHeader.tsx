'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LockOpen, Users, Lock} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Tag} from "@/models/Tag";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface MemberPreview {
    id: number;
    username: string;
    avatarUrl?: string | null;
}

interface GroupHeaderProps {
    name: string;
    visibility: string;
    membersCount?: number;
    imageUrl?: string;
    membersPreview?: MemberPreview[];
    tags?: Tag[];
}

export default function GroupHeader({name, visibility, membersCount, imageUrl, membersPreview, tags}: GroupHeaderProps) {
    const isPrivate = visibility === "private";

    return (
        <Card className="w-full bg-secondary-black p-6 mb-6 shadow border border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={imageUrl}/>
                        <AvatarFallback>
                            <Users/>
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="text-2xl font-bold text-white">{name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            {isPrivate ? (
                                <Lock className="w-4 h-4"/>
                            ) : (
                                <LockOpen className="w-4 h-4"/>
                            )}
                            <span className="capitalize">{visibility}</span> ·{" "}
                            <span>{membersCount} membres</span>
                        </div>

                        {membersPreview && membersPreview.length > 0 && (
                            <div className="flex -space-x-2 mt-2">
                                {membersPreview.map((member) => (
                                    <Tooltip key={member.id}>
                                        <TooltipTrigger asChild>
                                            <Avatar className="w-8 h-8 border-2 border-secondary-black">
                                                <AvatarImage src={member.avatarUrl || ""} />
                                                <AvatarFallback>{member.username[0]}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>{member.username}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        )}

                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag.slug} className="text-xs">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary">+ Inviter</Button>
                </div>
            </div>
        </Card>
    );
}