import {fetchActiveProfilePictures,} from "@/server-actions/main/settings/actions";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import {ProfilePicture} from "@/models/Profile";

type ImageUrls = {
    profile?: string;
    cover?: string;
};

const imageCache = new Map<number, ImageUrls>();

export const getProfileImageUrl = async (profileId: number): Promise<ImageUrls> => {
    if (imageCache.has(profileId)) return imageCache.get(profileId)!;

    try {
        const response = await fetchActiveProfilePictures(profileId);
        const urls: ImageUrls = {};
        const images: Record<string, ProfilePicture> = response.data;

        for (const type in images) {
            const image: ProfilePicture = images[type];
            const firebasePath = extractFirebasePath(image.url);

            if (firebasePath) {
                const firebaseRef = ref(storage, firebasePath);
                urls[type as keyof ImageUrls] = await getDownloadURL(firebaseRef);
            }
        }

        imageCache.set(profileId, urls);
        return urls;
    } catch (error: any) {
        return {};
    }
};

const extractFirebasePath = (url: string): string | null => {
    const regex = /\/o\/(.*)\?alt/;
    const match = url.match(regex);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
};