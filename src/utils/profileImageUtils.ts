import {fetchActiveProfilePictures,} from "@/server-actions/main/settings/actions";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "../../firebaseConfig";

type ImageUrls = {
    profile?: string;
    cover?: string;
};

export const getProfileImageUrl = async (profileId: number): Promise<ImageUrls> => {
    try {
        const response = await fetchActiveProfilePictures(profileId);

        if (!response) {
            throw new Error("Aucune image active trouvée.");
        }

        const urls: ImageUrls = {};

        for (const type in response) {
            const firebasePath = extractFirebasePath(response[type].url);
            if (firebasePath) {
                const firebaseRef = ref(storage, firebasePath);
                const firebaseUrl = await getDownloadURL(firebaseRef);

                urls[type as keyof ImageUrls] = `${firebaseUrl}?t=${Date.now()}`;
            }
        }

        return urls;
    }  catch (error: any) {
        if (404 === error.response && error.response.status) {
            return {};
        }

        throw error;
    }
};

const extractFirebasePath = (url: string): string | null => {
    const regex = /\/o\/(.*)\?alt/;
    const match = url.match(regex);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
};