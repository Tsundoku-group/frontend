export interface GroupMember {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    roleLabel: string;
    joinAt: {
        date: string;
    };
    avatarUrl?: string | null;
}