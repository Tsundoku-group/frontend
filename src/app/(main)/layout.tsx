'use client'

import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar"
import {SocketProvider} from "@/context/socketContext";
import React, {Suspense, useEffect, useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import GlobalLoader from "@/components/loader/GlobalLoader";
import InactivityDetector from "@/components/InactivityDetector";
import {PanelLeft, PanelRight} from "lucide-react";

export default function MainLayout({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const savedFont = localStorage.getItem("selectedFont");
        const savedHighContrast = localStorage.getItem("selectedHighContrast");
        const savedTextSize = localStorage.getItem("selectedTextSize");

        if (savedFont) {
            document.body.classList.add(savedFont);
        }

        if ("true" === savedHighContrast) {
            document.body.classList.add("high-contrast");
        } else {
            document.body.classList.remove("high-contrast");
        }

        if (savedTextSize) {
            document.documentElement.style.setProperty("--text-size", `${savedTextSize}px`);
        }
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<GlobalLoader/>}>
                    <SocketProvider>
                        <button
                            onClick={() => setIsCollapsed(prev => !prev)}
                            className="fixed top-4 z-50 p-2 rounded-xl bg-secondary-black hover:bg-tertiary-black transition border-2 border-tertiary-black"
                            style={{
                                left: isCollapsed ? '5.5rem' : '15.5rem',
                                transition: 'left 0.3s ease'
                            }}
                            aria-label="Collapse sidebar"
                        >
                            {isCollapsed ? (
                                <PanelRight className="text-white w-5 h-5" />
                            ) : (
                                <PanelLeft className="text-white w-5 h-5" />
                            )}
                        </button>
                        <div className="grid grid-cols-12">
                            <div className="col-span-2">
                                <Sidebar isCollapsed={isCollapsed}/>
                            </div>
                                <div className="mb-24">
                                    <Navbar isCollapsed={isCollapsed} />
                                </div>
                            <div
                                className="col-span-12 transition-all duration-300"
                                style={{
                                    marginLeft: isCollapsed ? '10.5rem' : '20.5rem',
                                    marginRight: '4em'
                                }}
                            >
                                <main style={{fontSize: 'var(--text-size)'}}>
                                    {children}
                                <InactivityDetector timeout={30000} />
                                </main>
                            </div>
                        </div>
                    </SocketProvider>
                </Suspense>
            </QueryClientProvider>
            <Toaster/>
        </>
    );
}
