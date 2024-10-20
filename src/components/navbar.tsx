import { Bell, ChevronDown } from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/logoutButton";

export default function Navbar() {
    return (
        <div className="h-16 flex justify-between items-center">
            <div className="text-text-white text-lg">
                Bienvenue, <span className="text-green-highlight">Anne Honyme</span> !
            </div>
            <div className="flex items-center">
                <Bell className="text-text-white mr-4" />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                <div className="flex items-center bg-tertiary-black p-2 rounded-lg cursor-pointer">
                    <div
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-text-white">Anne Honyme</span>
                    <ChevronDown className="text-text-white ml-2" />
                </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <LogoutButton/>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}