export interface Tag {
    name: string;
    slug: string;
    parent?: Tag | null;
}