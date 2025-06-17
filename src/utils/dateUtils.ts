type SymfonyDate = { date: string; timezone_type: number; timezone: string }

export const formatDate = (
    input: string | SymfonyDate
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

export const getRemainingTime = (endAt: string | SymfonyDate): string => {
    const now = new Date();
    const endDate = new Date(typeof endAt === "string" ? endAt : endAt.date);
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) {
        return 'terminé'
    }
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (days >= 1) {
        return `${days} j.`
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60))

    if (hours >= 1) {
        return `${hours} h.`
    }

    const minutes = Math.floor(diffMs / (1000 * 60))

    return `${minutes} min.`
}