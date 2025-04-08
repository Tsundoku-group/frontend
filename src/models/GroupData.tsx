export interface GroupData {
    id: string;
    name: string;
    description?: string;
    category?: string;
    visibility: string;
    membersCount: number;
    joinStatus: "none" | "pending" | "member";
    createdAt: string;
    imageUrl?: string;
    isFavorite: boolean;
    isPinned: boolean;
}