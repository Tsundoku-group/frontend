import { useState } from "react";
import { ShowToast } from "@/components/ShowToast";
import {Bookmark, Pin} from "lucide-react";

interface PinIconProps extends React.SVGProps<SVGSVGElement> {
    filled?: boolean;
}

interface MarkActionsProps {
    initialFavorite?: boolean;
    initialPinned?: boolean;
    initialRating?: number;
    onToggleFavorite?: () => Promise<void>;
    onTogglePinned?: () => Promise<void>;
    onRate?: (rating: number) => Promise<void>;
    showFavorite?: boolean;
    showPinned?: boolean;
    showRating?: boolean;
}

export default function MarkActions({
                                        initialFavorite = false,
                                        initialPinned = false,
                                        initialRating = 0,
                                        onToggleFavorite,
                                        onTogglePinned,
                                        onRate,
                                        showFavorite = false,
                                        showPinned = false,
                                        showRating = false,
                                    }: MarkActionsProps) {
    const [favorite, setFavorite] = useState(initialFavorite);
    const [pinned, setPinned] = useState(initialPinned);
    const [rating, setRating] = useState(initialRating);

    const handleToggleFavorite = async () => {
        if (!onToggleFavorite) return;
        try {
            await onToggleFavorite();
            setFavorite(!favorite);
            ShowToast("default", !favorite ? "Ajouté aux favoris" : "Favori retiré");
        } catch (error: any) {
            ShowToast("destructive", error.message, "Erreur");
        }
    };

    const handleTogglePinned = async () => {
        if (!onTogglePinned) return;
        try {
            await onTogglePinned();
            setPinned(!pinned);
            ShowToast("default", !pinned ? "Épinglé" : "Désépinglé");
        } catch (error: any) {
            ShowToast("destructive", error.message, "Erreur");
        }
    };

    const handleRating = async (newRating: number) => {
        if (!onRate) return;
        try {
            await onRate(newRating);
            setRating(newRating);
            ShowToast("default", `Note attribuée : ${newRating}`);
        } catch (error: any) {
            ShowToast("destructive", error.message, "Erreur");
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                {showFavorite && (
                    <button onClick={handleToggleFavorite} className="text-2xl focus:outline-none">
                        {favorite ? (
                            <Bookmark className="text-gray-400 fill-current" />
                        ) : (
                            <Bookmark className="text-gray-400" />
                        )}
                    </button>
                )}
                {showPinned && (
                    <button onClick={handleTogglePinned} className="focus:outline-none">
                        {pinned ? (
                            <Pin className="text-gray-400 fill-current" />
                        ) : (
                            <Pin className="text-gray-400" />
                        )}
                    </button>
                )}
            </div>
            {showRating && (
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} filled={rating >= star} onClick={() => handleRating(star)} />
                    ))}
                </div>
            )}
        </div>
    );
}

function Star({ filled, onClick }: { filled: boolean; onClick: () => void }) {
    return (
        <span onClick={onClick} style={{ cursor: "pointer", fontSize: "1.5rem" }}>
      {filled ? "★" : "☆"}
    </span>
    );
}