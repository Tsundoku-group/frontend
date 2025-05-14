import React from "react";
import {Card} from "@/components/ui/card";

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode;
}>

const ItemList = React.memo(({children, title, action: Action}: Props) => {
    return (
        <Card className="fixed h-[calc(100vh-155px)] w-full lg:flex-none lg:w-[300px] p-2 bg-secondary-black border-tertiary-black flex flex-col">
            <div className="flex items-center justify-between px-2 py-2 min-h-[60px]">
                <h3 className="text-2xl font-light tracking-tight text-text-white">{title}</h3>
                {Action && <div>{Action}</div>}
            </div>
            <div className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-start gap-2">
                {children}
            </div>
        </Card>
    );
});

ItemList.displayName = 'ItemList';

export default ItemList;