export interface GroupMember {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    roleLabel: string;
    joinAt: {
        date: string;
    };
    avatarUrl?: string | null;
}