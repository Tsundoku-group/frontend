import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import { Card } from "@/components/ui/card";
import { ChevronRight, Pen } from "lucide-react";
import Image from 'next/image';

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
        <Card className="bg-secondary-black p-4 border-spacing-1 border-gray-600">
            <h2 className="text-text-white text-lg font-semibold flex items-center mb-6">
                <div className="flex items-center">
                    <Pen className="w-4 h-4 mr-2"/> Articles ({articles.length})
                </div>
                <ChevronRight className="ml-auto"/>
            </h2>
            <div className="mt-3 space-y-4">
                {articles.map((article, index) => (
                    <div key={index} className="flex flex-col items-start space-y-2">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-24 object-cover rounded-lg"
                        />
                        <div>
                            <p className="text-green-500 font-semibold">{article.title}</p>
                            <p className="text-text-white text-sm font-extralight">{article.date}</p>
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