export interface Profile {
    id: number;
    role?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatarUrl?: string;
    coverUrl?: string;
    friendsCount?: number;
    followersCount?: number;
    birthday?: string | null;
    gender?: string;
    phoneNumber?: string;
    bio?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
    createdAt?: string | null;
}