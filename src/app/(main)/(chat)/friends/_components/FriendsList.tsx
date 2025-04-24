"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Send, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Friend} from "@/models/Friend";

type Props = {
    friends: Friend[];
    loading: boolean;
    onStartConversation: (friendId: number) => void;
};

const FriendsList = ({ friends, loading, onStartConversation }: Props) => {
    if (loading) {
        return <p>Chargement des amis...</p>;
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {friends.map((friend) => (
                <Card key={friend.friendId} className="w-full p-2 flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-4 truncate">
                        <Avatar>
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <p className="truncate">{friend.username}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onStartConversation(friend.friendId)}
                            size="icon"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default FriendsList;