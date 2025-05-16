import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library } from "lucide-react";
import StatsIcon from "@/assets/icons/StatsIcon";

const genresData = [
    { name: "Fantaisie", color: "bg-yellow-500", percentage: 66 },
    { name: "Science-fiction", color: "bg-orange-500", percentage: 25 },
    { name: "Fantastique", color: "bg-red-400", percentage: 40 },
    { name: "Solar Punk", color: "bg-green-500", percentage: 10 },
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
        <Card className="bg-secondary-black p-8 border-spacing-1 border-tertiary-black">
            <div className="text-text-white text-lg font-semibold flex items-center">
                <StatsIcon className="w-6 h-6 mr-2 fill-current text-text-white" /> Genres préférés
            </div>
            <div className="space-y-3 mt-3 p-2">
                {genres.map((genre, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <Badge
                                className={`bg-primary-black ${genre.color.replace("bg-", "text-")} max-w-max px-2`}
                            >
                                {genre.name.toLowerCase()}
                            </Badge>
                            <span className="text-text-white text-sm">
                                {genre.currentPercentage}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full">
                            <div
                                className={`h-full ${genre.color} rounded-full transition-all duration-300 ease-in-out`}
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