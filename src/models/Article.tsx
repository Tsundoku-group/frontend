export interface Article {
    id: string;
    type: string;
    author: string;
    title: string;
    content: string;
    visibility: string;
    status: string;
    createdAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    updatedAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
}