"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DesktopNav = () => {
    const paths = useNavigation();
    return (
        <Card className="h-full w-16 px-2 py-4 flex flex-col items-center justify-start bg-secondary-black border-none">
            <nav>
                <ul className="flex flex-col items-center gap-4">
                    {paths.map((path, id) => (
                        <li key={id} className="relative">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={path.href}>
                                        <Button
                                            size="icon"
                                            variant={path.active ? "default" : "outline"}
                                            className="bg-primary-black border-none hover:bg-transparent hover:text-inherit hover:shadow-none"
                                        >
                                            {path.icon}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{path.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </nav>
        </Card>
    );
};

export default DesktopNav;