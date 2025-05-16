import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import {Card} from "@/components/ui/card";
import {ChevronRight} from "lucide-react";
import Image from "next/image";
import FatThumbUpFilled from "@/assets/icons/FatThumbUpFilled";
import {Button} from "@/components/ui/button";

const ReviewsCard = () => {
    return (
        <Card className="bg-secondary-black p-8 pb-4 border-spacing-1 border-tertiary-black">
            <Button className="flex items-center justify-between w-full mb-6 bg-transparent hover:bg-tertiary-black">
                <div className="flex items-center text-text-white text-lg font-semibold">
                    <FatThumbUpFilled className="w-6 h-6 mr-2" />
                    <span>Avis (1)</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-white" />
            </Button>
            <div className="flex items-start mb-3 space-y-3">
                <Image
                    src="https://covers.openlibrary.org/b/id/8231991-L.jpg"
                    alt="image"
                    width={0}
                    height={0}
                    className="w-14 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                    <div className="text-text-white font-bold">Tonnerre après les ruines</div>
                    <div className="text-text-white font-extralight text-sm mt-1">Floriane Soulas</div>
                </div>
            </div>

            <div>
                <div className="text-green-highlight font-semibold text-sm">Coup de cœur de fin d’année !</div>
                <div className="text-text-white mt-2 text-sm leading-snug">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center">
                <ViewMoreButton/>
            </div>
        </Card>
    );
};

export default ReviewsCard;