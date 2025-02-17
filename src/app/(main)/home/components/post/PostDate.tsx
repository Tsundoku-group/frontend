import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";

export default function PostDate({ date }: { date: string }) {
    const parsedDate = useMemo(() => {
        if (!date || isNaN(Date.parse(date))) {
            return null;
        }
        return new Date(date);
    }, [date]);

    const timeAgo = useMemo(() => {
        if (!parsedDate) return "Date invalide";

        const secondsDiff = differenceInSeconds(new Date(), parsedDate);

        if (secondsDiff < 60) {
            return "il y a moins d'une minute";
        }

        return formatDistanceToNowStrict(parsedDate, { addSuffix: true, locale: fr });
    }, [parsedDate]);

    return <div className="text-green-400 text-xs">{timeAgo}</div>;
}