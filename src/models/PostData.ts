export interface PostData {
    id?: number;
    title: string;
    content: string;
    authorId?: number;
    groupId: number;
    visibility: "public" | "private";
    type: string;
}