export type ChatConversation = {
    id: string;
    isGroup: boolean;
    lastMessage?: LastMessage;
    participants: ChatParticipant[];
    isArchived: boolean;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

export type ChatParticipant = {
    id: string;
    userName: string;
    imageUrl?: string;
    email: string;
};

export type LastMessage = {
    sender_email: string;
    content: string;
    sent_by: string;
    sent_at: string;
    isRead: boolean;
};