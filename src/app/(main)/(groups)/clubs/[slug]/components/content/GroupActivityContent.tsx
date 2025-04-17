'use client'

import CreatePost from "@/components/post/CreatePost";
import Feed from "@/components/post/feed/Feed";
import React from "react";

interface Props {
    groupId: number;
}

export default function GroupActivityContent({groupId}: Props) {

    return (
        <div className="py-8 grid grid-cols-12 gap-[50px] mt-6">
            <div className="col-span-8 pl-8">
                <CreatePost groupId={groupId}/>
                <Feed groupId={groupId}/>
            </div>
            <div className="col-span-4 bg-secondary-black p-4">
                <p className="text-text-white">Side widgets</p>
            </div>
        </div>
    )
}