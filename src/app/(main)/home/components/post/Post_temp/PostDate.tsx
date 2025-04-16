import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";

export default function PostDate({ date }: { date: string }) {
    const parsedDate = useMemo(() => new Date(date), [date]);

    const timeAgo = useMemo(() =>
            parsedDate ? formatDistanceToNowStrict(parsedDate, { addSuffix: true, locale: fr }) : "",
        [parsedDate]);

    return <div className="text-green-400 text-xs">{timeAgo}</div>;
}