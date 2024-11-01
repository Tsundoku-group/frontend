'use client';

import React from "react";
import LatestReleasesWidget from "./components/LatestReleasesWidget";

export default function Home() {

    return (
        <>
            <div>
                <div className="py-6 grid grid-cols-12 gap-[100px]">
                    <div className="col-span-8 bg-secondary-black">
                        <h1 className="text-text-white">Main content</h1>
                    </div>
                    <div className="col-span-4">
                        <LatestReleasesWidget />
                    </div>
                </div>
            </div>
        </>
    )
};
