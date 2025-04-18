import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import { Card } from "@/components/ui/card";
import { ChevronRight, ThumbsUp } from "lucide-react";
import Image from "next/image";

const ReviewsCard = () => {
    return (
        <Card className="bg-secondary-black p-4 border-spacing-1 border-gray-600">
            <h2 className="text-text-white text-lg font-semibold flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <ThumbsUp className="w-5 h-5 mr-2" /> Avis (1)
                </div>
                <ChevronRight className="ml-auto" />
            </h2>
            <div className="mt-3 flex items-start">
                <Image
                    src="https://covers.openlibrary.org/b/id/8231991-L.jpg"
                    alt="image"
                    width={0}
                    height={0}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                    <p className="text-text-white font-bold">Tonnerre après les ruines</p>
                    <p className="text-text-white font-extralight">Floriane Soulas</p>
                    <p className="text-green-500">Coup de cœur de fin d’année !</p>
                    <p className="text-text-white mt-2 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </p>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center">
                <ViewMoreButton />
            </div>
        </Card>
    );
};

export default ReviewsCard;