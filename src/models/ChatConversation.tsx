export type ChatConversation = {
    id: string;
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
    id: string;
    username: string;
    imageUrl?: string;
    email: string;
};

export type LastMessage = {
    sender_email: string;
    content: string;
    sent_by: string;
    sent_at: string;
    isRead: boolean;
    isCurrentUser?: boolean,
};