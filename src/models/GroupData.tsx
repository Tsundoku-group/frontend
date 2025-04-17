import {Tag} from "@/models/Tag";

export interface GroupData {
    id: number;
    name: string;
    description?: string;
    category?: string;
    visibility: string;
    membersCount: number;
    joinStatus: "none" | "pending" | "member";
    createdAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    slug: string;
    imageUrl?: string;
    isFavorite: boolean;
    isPinned: boolean;
    membersPreview?: [];
    tags: Tag[];
    rules?: string[];
    activities?: string[];
    whoCanJoin?: string;
    externalLinks?: string[];
    createdBy: {
        id: number;
        username: string;
    };
}