'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"
import {SocketProvider} from "@/context/socketContext";
import React from "react";
import {Toaster} from "@/components/ui/toaster";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function MainLayout({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
        <Toaster/>
        </body>
        </html>
    );
}