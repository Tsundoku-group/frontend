export interface PostData {
    id: string;
    title: string;
    content: string;
    authorId?: string;
    groupId: number;
    visibility: "public" | "private";
}