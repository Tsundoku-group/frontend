import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from 'next/image';
import PencilFilled from "@/assets/icons/PencilFilled";
import {Button} from "@/components/ui/button";

const articles = [
    {
        title: "Les livres qui ont marqué mon année",
        date: "Publié le 30.12.23 à 15:02",
        imageUrl: "https://covers.openlibrary.org/b/id/8284972-L.jpg",
    },
    {
        title: "La saga de Stefan Platteau",
        date: "Publié le 02.02.24 à 23:40",
        imageUrl: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
    },
];

const ArticlesCard = () => {
    return (
        <Card className="bg-secondary-black p-8 pb-4 border-spacing-1 border-tertiary-black">
            <Button className="flex items-center justify-between w-full mb-6 bg-transparent hover:bg-tertiary-black">
                <div className="flex items-center text-text-white text-lg font-semibold">
                    <PencilFilled className="w-6 h-6 mr-2"/> Articles ({articles.length})
                </div>
                <ChevronRight className="ml-auto"/>
            </Button>
            <div className="mt-3 space-y-4">
                {articles.map((article, index) => (
                    <div key={index} className="flex flex-col items-start space-y-2">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            width={0}
                            height={0}
                            className="w-full h-24 object-cover rounded-lg"
                        />
                        <div>
                            <div className="text-green-highlight font-semibold text-sm">{article.title}</div>
                            <div className="text-text-white mt-1 text-xs leading-snug">{article.date}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex flex-col items-center">
                <ViewMoreButton/>
            </div>
        </Card>
    );
};

export default ArticlesCard;