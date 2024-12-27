import {fetchActiveProfilePictureUrl} from "@/app/(main)/(settings)/profileSettings/actions";
import {getDownloadURL, ref} from "@firebase/storage";
import {storage} from "../../firebaseConfig";

export const getProfileImageUrl = async (profileId: string, defaultImageUrl: string): Promise<string> => {
    try {
        const response = await fetchActiveProfilePictureUrl(profileId);

        if (response && response.url) {
            const regex = /\/o\/(.*)\?alt/;
            const match = response.url.match(regex);
            const firebasePath = match && match[1] ? decodeURIComponent(match[1]) : null;

            if (firebasePath) {
                const firebaseRef = ref(storage, firebasePath);
                const firebaseUrl = await getDownloadURL(firebaseRef);

                return `${firebaseUrl}?t=${Date.now()}`;
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement de l'image :", error);
    }

    return defaultImageUrl;
};