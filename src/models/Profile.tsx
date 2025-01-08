export interface Profile {
    id: string;
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
}

export interface ProfilePicture {
    id: string;
    profileId: string;
    url: string;
    type: string;
}
