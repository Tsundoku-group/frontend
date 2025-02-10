export interface PostData {
    title: string;
    content: string;
    authorId?: string;
    groupId: number;
    visibility: "public" | "private";
}