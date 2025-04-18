import {fetchActiveProfilePictures,} from "@/server-actions/main/settings/actions";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "@/config/firebaseConfig";
import {ProfilePicture} from "@/models/Profile";

type ImageUrls = {
    profile?: string;
    cover?: string;
};


export const getProfileImageUrl = async (profileId: number): Promise<ImageUrls> => {
    try {
        const response = await fetchActiveProfilePictures(profileId);

        const urls: ImageUrls = {};
        const images: Record<string, ProfilePicture> = response.data;

        for (const type in images) {
            const image: ProfilePicture = images[type];
            const firebasePath = extractFirebasePath(image.url);

            if (firebasePath) {
                const firebaseRef = ref(storage, firebasePath);
                const firebaseUrl = await getDownloadURL(firebaseRef);
                urls[type as keyof ImageUrls] = `${firebaseUrl}?t=${Date.now()}`;
            }
        }

        return urls;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return {};
        }

        return {};
    }
};

const extractFirebasePath = (url: string): string | null => {
    const regex = /\/o\/(.*)\?alt/;
    const match = url.match(regex);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
};