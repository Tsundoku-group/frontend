"use client";

import { useSettingsNavigation } from "@/hooks/useSettingsNavigation";
import Link from "next/link";

const SettingsNav = () => {
    const paths = useSettingsNavigation();

    return (
        <div className=" p-4 rounded-lg w-64">
            <nav>
                <ul className="space-y-1">
                    {paths.map((path, id) => (
                        <li key={id}>
                            <Link href={path.href}>
                                <div
                                    className={`flex items-center p-2 rounded-lg hover:bg-gray-800 transition ${
                                        path.active ? "bg-gray-800 border-l-4 border-purple-500" : ""
                                    }`}
                                >
                                    <div className="flex-shrink-0 text-gray-400">
                                        {path.icon}
                                    </div>
                                    <span className={`ml-3 text-sm ${
                                        path.active ? "text-white font-semibold" : "text-gray-400"
                                    }`}>
                                        {path.name}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default SettingsNav;