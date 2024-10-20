'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"
import {SocketProvider} from "@/context/socketContext";
import React from "react";
import {Toaster} from "@/components/ui/toaster";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SocketProvider>
            <div className="grid grid-cols-12">
                <div className="col-span-2">
                    <Sidebar/>
                </div>
                <div className="col-span-10 mr-[4em]">
                    <Navbar/>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </SocketProvider>
        <Toaster/>
        </body>
        </html>
    );
}