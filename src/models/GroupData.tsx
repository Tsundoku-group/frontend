export interface GroupData {
    id: string;
    name: string;
    description?: string;
    category?: string;
    visibility: string;
    membersCount: number;
    createdAt: string;
    imageUrl?: string;
}