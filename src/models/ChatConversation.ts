export type ChatConversation = {
    id: number;
    lastMessage?: LastMessage;
    participants: ChatParticipant[];
    isArchived: boolean;
    archivedAt?: string;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

export type ChatParticipant = {
    id: number;
    username: string;
    imageUrl?: string;
};

export type LastMessage = {
    sender_email: string;
    content: string;
    sent_by: string;
    sent_at: string;
    isRead: boolean;
    isCurrentUser?: boolean,
};