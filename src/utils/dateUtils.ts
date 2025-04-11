export const formatDate = (
    input: string | { date: string; timezone_type: number; timezone: string }
): string => {
    const dateString = typeof input === "string" ? input : input.date;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Date invalide";
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) {
        return "à l'instant";
    } else if (diffMinutes < 60) {
        return `il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
        return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    } else {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }
};