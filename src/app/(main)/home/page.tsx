'use client';

import React from "react";
import CreatePost from "@/components/post/CreatePost";
import Feed from "@/components/post/feed/Feed";
import {useProfileContext} from "@/context/profileContext";

export default function Home() {
    const groupId = 1;
    const {activeProfileInStorage, profileImageUrls} = useProfileContext();
    const profileImageUrl = profileImageUrls[`${activeProfileInStorage?.id || ""}-profile`];

    return (
        <>
            <div className="py-6 grid grid-cols-12 gap-[50px] mt-2">
                <div className="col-span-8 pr-12">
                    <CreatePost groupId={groupId} profileImageUrl={profileImageUrl}/>
                    <Feed groupId={groupId}/>
                </div>
                <div className="col-span-4 bg-secondary-black p-4">
                    <p className="text-text-white">Side widgets</p>
                </div>
            </div>
        </>
    )
};
