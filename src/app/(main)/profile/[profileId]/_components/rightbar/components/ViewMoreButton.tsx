import React from "react";
import {Button} from "@/components/ui/button";

const ViewMoreButton = () => {
    return (
        <>
            <div className="w-full border-t border-tertiary-black"/>
            <Button className="mt-4 text-center bg-transparent hover:bg-tertiary-black hover:text-white">
                <div className="text-green-highlight text-sm font-semibold">
                    Voir plus
                </div>
            </Button>
        </>
    );
};

export default ViewMoreButton;