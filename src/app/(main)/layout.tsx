'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar"
import {SocketProvider} from "@/context/socketContext";
import React, {useEffect} from "react";
import {Toaster} from "@/components/ui/toaster";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function MainLayout({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    useEffect(() => {
        const savedFont = localStorage.getItem("selectedFont");
        const savedHighContrast = localStorage.getItem("selectedHighContrast");
        const savedTextSize = localStorage.getItem("selectedTextSize");

        if (savedFont) {
            document.body.classList.add(savedFont);
        }

        if ("true" === savedHighContrast ) {
            document.body.classList.add("high-contrast");
        } else {
            document.body.classList.remove("high-contrast");
        }
        console.log(savedTextSize)
        if (savedTextSize) {
            document.documentElement.style.setProperty("--text-size", `${savedTextSize}px`);
        }
    }, []);

    return (
        <html lang="fr">
        <body>
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                <div className="grid grid-cols-12">
                    <div className="col-span-2">
                        <Sidebar/>
                    </div>
                    <div className="col-span-10 mr-[4em]">
                        <Navbar/>
                        <main style={{ fontSize: 'var(--text-size)' }}>
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