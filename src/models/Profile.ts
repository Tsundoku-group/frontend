export interface Profile {
    id: number;
    role?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
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
    status?: string | 'offline';
    profileImageUrl?: string;
    coverImageUrl?: string;
    lastTwoFriends?: [] | null;
    error?: string;
}

export interface ProfilePicture {
    id: number;
    profileId: string;
    url: string;
    type: string;
}

export type ProfileResult = {
    data?: Profile;
    error?: string;
}