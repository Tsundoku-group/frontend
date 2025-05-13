export interface BooksList {
    id: number;
    title: string;
    profile: number;
    books: {};
    type: string;
    visibility: string;
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
    favorite: boolean;
}
