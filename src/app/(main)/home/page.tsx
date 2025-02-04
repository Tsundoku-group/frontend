'use client';

import React from "react";
import CreatePost from "@/app/(main)/home/components/CreatePost";

export default function Home() {

    return (
        <>
            <div>
            <div className="py-6 grid grid-cols-11 gap-[50px]">
                    <div className="col-span-8 p-4">
                        <CreatePost />
                    </div>
                    <div className="col-span-3 bg-secondary-black p-4">
                        <p className="text-text-white">Side widgets</p>
                    </div>
                </div>
            </div>
        </>
    )
};
