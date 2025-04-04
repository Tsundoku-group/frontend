// import { extractFirebasePath } from "./firebaseUtils";
// import { getDownloadURL, ref } from "@firebase/storage";
// import { storage } from "../../firebaseConfig";
// import { fetchArticleImage } from "@/app/(main)/articles/actions";

// export const getArticleImageUrl = async (articleId: string): Promise<string | null> => {
//     try {
//         const response = await fetchArticleImage(articleId);

//         if (!response) {
//             throw new Error("Aucune image d'article trouvée.");
//         }

//         const firebasePath = extractFirebasePath(response.url);
//         if (firebasePath) {
//             const firebaseRef = ref(storage, firebasePath);
//             const firebaseUrl = await getDownloadURL(firebaseRef);

//             return `${firebaseUrl}?t=${Date.now()}`;
//         }

//         return null;
//     } catch (error: any) {
//         if (404 === error.response && error.response.status) {
//             return null;
//         }

//         throw error;
//     }
// }