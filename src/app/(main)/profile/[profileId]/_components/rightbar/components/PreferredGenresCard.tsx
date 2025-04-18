import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library } from "lucide-react";

const genresData = [
    { name: "Fantaisie", color: "bg-yellow-500", percentage: 66 },
    { name: "Science-fiction", color: "bg-purple-500", percentage: 25 },
    { name: "Fantastique", color: "bg-red-400", percentage: 40 },
    { name: "Solar Punk", color: "bg-green-500", percentage: 10 },
    { name: "Historique", color: "bg-amber-100", percentage: 20 },
];

const PreferredGenresCard = () => {
    const [genres, setGenres] = useState(
        genresData.map((genre) => ({ ...genre, currentPercentage: 0 }))
    );

    useEffect(() => {
        const timers = genres.map((_, index) => {
            return setInterval(() => {
                setGenres((prevGenres) =>
                    prevGenres.map((genre, i) => {
                        if (i === index && genre.currentPercentage < genre.percentage) {
                            return { ...genre, currentPercentage: genre.currentPercentage + 1 };
                        }
                        return genre;
                    })
                );
            }, 10);
        });

        return () => timers.forEach((timer) => clearInterval(timer));
    }, [genres]);

    return (
        <Card className="bg-secondary-black p-4 border-spacing-1 border-gray-600">
            <h2 className="text-text-white text-lg font-semibold flex items-center">
                <Library className="w-6 h-6 mr-2" /> Genres préférés
            </h2>
            <div className="space-y-4 mt-3">
                {genres.map((genre, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <Badge className="bg-dark-700 text-white max-w-max px-2">
                                {genre.name}
                            </Badge>
                            <span className="text-text-white text-sm">
                                {genre.currentPercentage}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full">
                            <div
                                className={`h-full ${genre.color} rounded-full`}
                                style={{ width: `${genre.currentPercentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PreferredGenresCard;