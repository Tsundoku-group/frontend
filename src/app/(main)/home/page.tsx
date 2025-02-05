'use client';

import React from "react";
import CreatePost from "@/app/(main)/home/components/CreatePost";
import Feed from "@/app/(main)/home/components/feed/Feed";

export default function Home() {

    return (
        <>
            <div className="py-8 grid grid-cols-12 gap-[50px] mt-6">
                <div className="col-span-8 pl-8">
                    <CreatePost/>
                    <Feed/>
                </div>
                <div className="col-span-4 bg-secondary-black p-4">
                    <p className="text-text-white">Side widgets</p>
                </div>
            </div>
        </>
    )
};
