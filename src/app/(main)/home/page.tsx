'use client';

import React from "react";

export default function Home() {

    return (
        <>
            <div>
            <div className="py-6 grid grid-cols-12 gap-[100px]">
                    <div className="col-span-8 bg-secondary-black p-4">
                        <h1 className="text-text-white">Main content</h1>
                    </div>
                    <div className="col-span-4 bg-secondary-black p-4">
                        <p className="text-text-white">Side widgets</p>
                    </div>
                </div>
            </div>
        </>
    )
};
