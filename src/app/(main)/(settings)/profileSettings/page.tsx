'use client';

import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutationState} from "@/hooks/useMutationState";
import {useProfileContext} from "@/context/profileContext";
import {Profile} from "@/models/Profile";
import {
    deleteUserProfilePictureUrl,
    fetchUploadImageProfile,
    fetchUserProfileData,
    updateUserProfileData,
} from "@/app/(main)/(settings)/profileSettings/actions";
import {Facebook, Instagram, Loader2, Twitter} from "lucide-react";
import {useAuthContext} from "@/context/authContext";
import {ShowToast} from "@/components/ShowToast";
import {storage} from "../../../../../firebaseConfig";
import {deleteObject, getDownloadURL, listAll, ref} from "@firebase/storage";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/croppedImg";

interface ImageProps {
    profileImage: string | null;
    coverImage: string | null;
    profilePreview: string | null;
    coverPreview: string | null;
}

type ProfilePictureSectionProps = {
    imageUrl: string;
    coverUrl: string;
    name: string;
}

interface ImageCropDialogProps {
    firebasePath: string;
    isOpen: boolean;
    type: "profile" | "cover";
    onClose: () => void;
    onCropComplete: (croppedImage: Blob) => void;
}

const ProfileSchema = z.object({
    lastName: z.string().min(5).max(25),
    firstName: z.string().min(5).max(25),
    username: z.string().min(5).max(25),
    birthday: z.string().optional(),
    gender: z.enum(["Masculin", "Féminin", "Autre"]).optional(),
    phoneNumber: z.string().regex(/^\d{10}$/),
    bio: z.string().max(500).optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    x: z.string().url().optional(),
});

function FormField({label, children, error}: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div className="space-y-1">
            <label className="text-sm">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

const ProfileAndCoverImage: React.FC<ImageProps> = ({profileImage, coverImage, profilePreview, coverPreview}) => {
    const {activeProfileInStorage, profileImageUrls, refreshProfileImage} = useProfileContext();
    const [isCropDialogOpen, setIsCropDialogOpen] = useState<{ type: "profile" | "cover" | null }>({type: null});
    const [profileUrl, setProfileUrl] = useState<string>("");
    const [coverUrl, setCoverUrl] = useState<string>("");

    useEffect(() => {
        const profileId = activeProfileInStorage?.id || "";
        setProfileUrl(
            profileImageUrls[`${profileId}-profile`] || profilePreview || profileImage || ""
        );
        setCoverUrl(
            profileImageUrls[`${profileId}-cover`] || coverPreview || coverImage || ""
        );
    }, [profileImageUrls, activeProfileInStorage, profilePreview, profileImage, coverPreview, coverImage]);

    const handleCropComplete = async (croppedImage: Blob, type: "profile" | "cover") => {
        const formData = new FormData();
        formData.append("file", croppedImage);
        formData.append("profileId", String(activeProfileInStorage?.id));
        formData.append("type", type);

        try {
            const response = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                refreshProfileImage(activeProfileInStorage?.id as number, type);
                setIsCropDialogOpen({type: null});
            } else {
                ShowToast("destructive", "Erreur lors de l'upload.", "Erreur");
            }
        } catch (error) {
            ShowToast("destructive", "Erreur lors de l'upload.", "Erreur");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center space-y-3">
                <h4 className="text-base font-semibold mb-2">Photo de profil</h4>
                <div
                    onClick={() => setIsCropDialogOpen({type: "profile"})}
                    className="cursor-pointer"
                >
                    <Avatar className="w-40 h-40 border-2 border-gray-300 hover:border-blue-500 transition-all">
                        <AvatarImage
                            src={profileUrl}
                            alt={activeProfileInStorage?.username || "Profile Image"}
                            className="object-cover object-center"
                        />
                        <AvatarFallback className="bg-gray-400">150 x 150</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-3 mt-6">
                <h4 className="text-base font-semibold mb-2">Photo de couverture</h4>
                <div
                    onClick={() => setIsCropDialogOpen({type: "cover"})}
                    className="cursor-pointer w-full max-w-3xl h-48 border-1 border-gray-300 hover:border-blue-500 transition-all"
                >
                   <Avatar className="w-full h-full rounded-lg border-1 border-gray-300 hover:border-blue-500 transition-all">
                       <AvatarImage
                           src={coverUrl}
                           alt={activeProfileInStorage?.username || "Cover Image"}
                           className="object-cover object-center"
                           />
                       <AvatarFallback className="bg-gray-400 rounded-none">600 x 400</AvatarFallback>
                   </Avatar>
                </div>
            </div>

            {isCropDialogOpen.type && (
                <ImageCropDialog
                    firebasePath={isCropDialogOpen.type === "profile" ? profileUrl : coverUrl}
                    isOpen={!!isCropDialogOpen.type}
                    type={isCropDialogOpen.type}
                    onClose={() => setIsCropDialogOpen({type: null})}
                    onCropComplete={(croppedImage) =>
                        handleCropComplete(croppedImage, isCropDialogOpen.type!)
                    }
                />
            )}
        </>
    );
};

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({firebasePath, isOpen, type, onClose, onCropComplete}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const {activeProfileInStorage, refreshProfileImage} = useProfileContext();
    const {user} = useAuthContext();
    const profileId = activeProfileInStorage?.id as number;
    const userId = user?.userId || 0;

    const aspectRatio = type === 'profile' ? 1 : 16 / 9;

    useEffect(() => {
        const loadFirebaseImage = async () => {
            try {
                const downloadUrl = await getDownloadURL(ref(storage, firebasePath));
                if (downloadUrl) {
                    setImageUrl(downloadUrl);
                }
            } catch (error: any) {
                if ('storage/object-not-found' === error.code) {
                    setImageUrl(null);
                }
            }
        };

        if (firebasePath) {
            loadFirebaseImage();
        } else {
            setImageUrl(null);
        }
    }, [firebasePath]);

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageUrl || !croppedAreaPixels) return;

        setLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
            const croppedFile = new File([croppedImageBlob], `${type}-cropped-image.jpg`, {type: "image/jpeg"});

            await handleUploadNewImage({
                file: croppedFile,
                profileId,
                userId,
                type,
                onUploadSuccess: () => {
                    refreshProfileImage(profileId, type);
                    onCropComplete(croppedImageBlob);
                    onClose();
                },
                onError: (message) => ShowToast("destructive", message),
                setLoading,
            });
        } catch (error) {
            ShowToast("destructive", "Erreur lors du recadrage.", "Erreur")
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Recadrer l&apos;image</DialogTitle>
                    <DialogDescription>
                        Ajustez et recadrez votre image avant de l&apos;enregistrer.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-80 bg-gray-900">
                    {imageUrl && (
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteHandler}
                        />
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center">
                    <label className="text-sm mb-2">Zoom :</label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Enregistrer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

async function handleUploadNewImage({file, profileId, userId, type, onUploadSuccess, onError, setLoading}: {
    file: File;
    profileId: number;
    userId: number;
    type: string;
    onUploadSuccess: (url: string) => void;
    onError: (message: string) => void;
    setLoading: (loading: boolean) => void;
}) {
    if (!file) {
        onError("Veuillez sélectionner un fichier valide.");
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);
        formData.append("profileId", String(profileId));
        formData.append("type", type);

        const apiResponse = await fetch("/api/uploadImage", {
            method: "POST",
            body: formData,
        });

        if (!apiResponse.ok) {
            if (apiResponse.status === 409) {
                await apiResponse.json();
                ShowToast("destructive", "Le fichier existe déjà.", "Erreur");
            }
            ShowToast("destructive", "Erreur lors de l'enregistrement en base de données.", "Erreur");
        }

        const data = await apiResponse.json();

        const symfonyResponse = await fetchUploadImageProfile(userId, profileId, data.url, type);
        if (!symfonyResponse) {
            ShowToast("destructive", "Erreur lors de l'enregistrement en base de données.", "Erreur");
        }

        onUploadSuccess(data.url);
        ShowToast("default", "Image téléchargée avec succès !");
    } catch (error: any) {
        onError(error.message || "Erreur lors du téléchargement.");
    } finally {
        setLoading(false);
    }
}

const ProfilePictureSection = React.memo(({imageUrl, coverUrl}: ProfilePictureSectionProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<"profile" | "cover">("profile");
    const [tempProfilePreview, setTempProfilePreview] = useState<string | null>(imageUrl);
    const [tempCoverPreview, setTempCoverPreview] = useState<string | null>(coverUrl);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentAvatar, setCurrentAvatar] = useState<string>(imageUrl || '');
    const [coverImage, setCoverImage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {user} = useAuthContext();
    const userId = user?.userId;
    const {activeProfileInStorage, refreshProfileImage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;

    useEffect(() => {
        const fetchImages = async () => {
            if (!profileId) return;

            try {
                const fetchImagesByType = async (type: "profile" | "cover") => {
                    const folderPath = type === "profile"
                        ? `profilePictures/${profileId}`
                        : `coverPictures/${profileId}`;

                    const folderRef = ref(storage, folderPath);
                    const result = await listAll(folderRef);

                    return await Promise.all(
                        result.items.map(async (item) => {
                            const url = await getDownloadURL(item);
                            return {url, type};
                        })
                    );
                };

                const [profileImages, coverImages] = await Promise.all([
                    fetchImagesByType("profile"),
                    fetchImagesByType("cover")
                ]);

                profileImages.forEach((img) => setCurrentAvatar(img.url));
                coverImages.forEach((img) => setCoverImage(img.url));

            } catch (error) {
                ShowToast("destructive", "Erreur lors du chargement des images.", "Erreur");
            }
        };

        fetchImages();
    }, [profileId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSize = 2 * 1024 * 1024; // 2 Mo

        const dimensions = type === 'profile'
            ? { minWidth: 150, minHeight: 150, maxWidth: 150, maxHeight: 150 }
            : { minWidth: 600, minHeight: 400, maxWidth: 1200, maxHeight: 800 };

        if (!allowedTypes.includes(file.type) || file.size > maxSize) {
            setErrorMessage(
                !allowedTypes.includes(file.type)
                    ? "Seuls les fichiers JPEG et PNG sont acceptés."
                    : "Le fichier est trop volumineux. Taille maximale : 2 Mo."
            )
            return;
        }

        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const isValidWidth = image.width >= dimensions.minWidth && image.width <= dimensions.maxWidth;
            const isValidHeight = image.height >= dimensions.maxHeight && image.height <= dimensions.maxWidth;
            if (!isValidWidth || !isValidHeight) {
                setErrorMessage(`Dimensions requises pour ${type} : entre ${dimensions.minWidth}x${dimensions.minHeight}px et ${dimensions.maxWidth}x${dimensions.maxHeight}px.`,);
            } else {
                if (type === "profile") {
                    setTempProfilePreview(URL.createObjectURL(file));
                } else {
                    setTempCoverPreview(URL.createObjectURL(file));
                }
                setSelectedFile(file);
                setErrorMessage(null);
            }
        }
    };

    const UploadedImagesList = ({userId, profileId, type}: { userId: number, profileId: number, type: string }) => {
        const [images, setImages] = useState<{ url: string; type: string }[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        useEffect(() => {
            const fetchImages = async () => {
                if (!profileId || !type) return;

                try {
                    setIsLoading(true);
                    setErrorMessage(null);

                    const folderPath = type === "profile"
                        ? `profilePictures/${profileId}`
                        : `coverPictures/${profileId}`;
                    const folderRef = ref(storage, folderPath);
                    const result = await listAll(folderRef);

                    const urls = await Promise.all(
                        result.items.map(async (item) => {
                            const url = await getDownloadURL(item);
                            return {url, type};
                        })
                    );

                    setImages(urls);
                } catch (error) {
                    ShowToast("destructive", "Impossible de charger les photo de profils", "Erreur");
                } finally {
                    setIsLoading(false);
                }
            }

            fetchImages();
        }, [profileId, type]);

        const handleDeleteImage = async (url: string, type: string) => {
            try {
                const path = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);
                const imageRef = ref(storage, path);

                await deleteObject(imageRef);

                const symfonyResponse = await deleteUserProfilePictureUrl(userId, profileId, url, type);

                if (!symfonyResponse) {
                    ShowToast("destructive", "Erreur lors de la suppression de l'image.", "Erreur");
                }

                ShowToast("default", "Image supprimée");

                const folderPath = type === "profile"
                    ? `profilePictures/${profileId}`
                    : `coverPictures/${profileId}`;
                const folderRef = ref(storage, folderPath);
                const result = await listAll(folderRef);

                if (0 === result.items.length) {
                    setImages([]);
                    return;
                }

                const updatedImages = result.items.map((item) => ({
                    url: `https://firebasestorage.googleapis.com/v0/b/${item.bucket}/o/${encodeURIComponent(item.fullPath)}?alt=media`,
                    type: item.fullPath.startsWith(`profilePictures/`) ? "profile" : "other",
                }));

                setImages(updatedImages);
            } catch (error) {
                ShowToast("destructive", "Impossible de supprimer l'image.", "Erreur");
            }
        };

        const displayedImages = images.slice(0, 4);

        return (
            <div className="mt-4">
                <div className="text-lg font-semibold mb-3">Images téléchargées</div>

                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-black"/>
                    </div>
                ) : null}

                {errorMessage && (<p className="text-gray-500 text-sm">{errorMessage}</p>)}

                {!isLoading && images.length === 0 && <p>Aucune image trouvée.</p>}

                <div className="grid grid-cols-4 gap-2 mt-4">
                    {displayedImages.map(({url, type}, index) => (
                        <div key={index} className="relative flex items-center justify-center">
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-24 h-24 rounded-md object-cover border border-gray-300"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://via.placeholder.com/150?text=Image+invalide";
                                }}
                            />
                            <button
                                onClick={() => handleDeleteImage(url, type)}
                                className="absolute top-1 right-5 bg-gray-500 text-white p-1 rounded-full text-xs hover:bg-red-highlight focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {images.length > 4 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="col-span-4 text-blue-500 hover:underline mt-2"
                        >
                            Voir plus
                        </button>
                    )}
                </div>

                {isModalOpen ? (
                    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <AlertDialogOverlay/>
                        <AlertDialogContent
                            className="max-w-4xl w-full bg-tertiary-black border-none max-h-[80vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Toutes les images</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {images.map(({url, type}, index) => (
                                    <div key={index} className="relative flex items-center justify-center">
                                        <img
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            className="w-24 h-24 rounded-md object-cover border border-gray-300"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://via.placeholder.com/150?text=Image+invalide";
                                            }}
                                        />
                                        <button
                                            onClick={() => handleDeleteImage(url, type)}
                                            className="absolute top-1 right-12 bg-gray-500 text-white p-1 rounded-full text-xs hover:bg-red-highlight focus:outline-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 border-none">
                                    Fermer
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null}
            </div>
        );
    };

    const handleCancelUpdatePicture = () => {
        setTempProfilePreview(null);
        setTempCoverPreview(null);
        setSelectedFile(null);
        setErrorMessage(null);
        setIsDialogOpen(false);
    };

    const handleOpenDialog = (type: "profile" | "cover") => {
        setSelectedType(type);

        if (type === "profile") {
            setTempProfilePreview(currentAvatar);
        } else {
            setTempCoverPreview(coverImage);
        }

        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center space-y-3">
                <ProfileAndCoverImage
                    profileImage={imageUrl}
                    coverImage={""}
                    profilePreview={null}
                    coverPreview={null}
                />

                <div className="flex space-x-4 mt-6">
                    <Button
                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
                        onClick={() => handleOpenDialog("profile")}
                    >
                        Modifier Profil
                    </Button>
                    <Button
                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
                        onClick={() => handleOpenDialog("cover")}
                    >
                        Modifier Couverture
                    </Button>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogOverlay/>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedType === "profile" ? "Changer la photo de profil" : "Changer la photo de couverture"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Sélectionnez une image à téléverser.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex flex-col items-center space-y-3">
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                        )}
                        <Avatar className={selectedType === "cover" ? "w-full h-48 rounded-lg" : "w-32 h-32"}>
                            {selectedType === "profile" ? (
                                <AvatarImage
                                    src={tempProfilePreview || currentAvatar || ""}
                                    className="object-cover object-center"
                                />
                            ) : (
                                <AvatarImage
                                    src={tempCoverPreview || coverImage || ""}
                                    alt="Cover Image"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            )}

                            <AvatarFallback
                                className={`flex items-center justify-center bg-gray-400 text-sm font-semibold ${
                                    selectedType === "cover" ? "text-gray-300 w-full h-48" : "text-gray-500 w-32 h-32"
                                }`}
                            >
                                {selectedType === "profile" ? "150 x 150" : "600 x 400"}
                            </AvatarFallback>
                        </Avatar>
                        <UploadedImagesList userId={userId} profileId={profileId} type={selectedType}/>
                        <Input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={(e) => handleFileChange(e, selectedType)}
                            className="w-full"
                        />
                    </div>

                    <AlertDialogFooter>
                        <Button variant="outline" onClick={handleCancelUpdatePicture}>
                            Annuler
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!selectedFile) {
                                    ShowToast("destructive", "Veuillez sélectionner une image.", "Erreur");
                                    return;
                                }

                                await handleUploadNewImage({
                                    file: selectedFile,
                                    profileId,
                                    userId,
                                    type: selectedType,
                                    onUploadSuccess: (url) => {
                                        if (selectedType === "profile") {
                                            setCurrentAvatar(url);
                                            setTempProfilePreview(url);
                                        } else {
                                            setCoverImage(url);
                                            setTempCoverPreview(url);
                                        }
                                        refreshProfileImage(profileId as number, selectedType);
                                        setIsDialogOpen(false);
                                    },
                                    onError: (message) => ShowToast("destructive", message),
                                    setLoading: setIsLoading,
                                });
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Enregistrement..." : "Confirmer"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
});

ProfilePictureSection.displayName = "ProfilePictureSection";

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const {mutate, pending} = useMutationState(async (updatedProfile: Profile) => {
        return await updateUserProfileData(profileId as number, updatedProfile);
    });

    const fetchUserProfile = useCallback(async () => {
        if (!profileId) return;

        try {
            const data: Profile = await fetchUserProfileData(profileId);
            setProfile({...data|| "Autre"});
        } catch (error) {
            ShowToast("destructive", "Erreur lors de la récupération du profil. Veuillez réessayer plus tard.", "Erreur");
        }
    }, [profileId]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const {register, handleSubmit, reset, formState} = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: sanitizeProfile(profile) || {},
    });

    function sanitizeProfile(profile: Profile | null): z.infer<typeof ProfileSchema> | {} {
        if (!profile) return {};

        return {
            lastName: profile.lastName || "",
            firstName: profile.firstName || "",
            username: profile.username || "",
            birthday: profile.birthday || undefined,
            gender: profile.gender || "Autre",
            phoneNumber: profile.phoneNumber || "",
            bio: profile.bio || undefined,
            facebook: profile.facebook || undefined,
            instagram: profile.instagram || undefined,
            x: profile.x || undefined,
        };
    }

    useEffect(() => {
        if (profile) {
            reset(sanitizeProfile(profile));
        }
    }, [profile, reset]);

    const handleDialogOpen = () => setIsDialogOpen(true);
    const handleDialogClose = () => setIsDialogOpen(false);

    const handleConfirmUpdate = async (data: z.infer<typeof ProfileSchema>) => {
        try {
            const updatedProfile = await mutate(data);
            setProfile(updatedProfile);
            handleDialogClose();
            await fetchUserProfile();
        } catch (err) {
            ShowToast("destructive", "Erreur lors de la modification du profil. Veuillez réessayer plus tard.", "Erreur");
        }
    };

    return (
        <div className="flex items-start p-4 text-white">
            <div className="max-w-3xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-semibold mb-8">Profil</h3>
                    <form onSubmit={handleSubmit(() => handleDialogOpen())}>
                        <FormField label="Nom" error={formState.errors.lastName?.message}>
                            <Input
                                {...register("lastName")}
                                placeholder="Dupont"
                                className="text-sm text-black"
                            />
                        </FormField>

                        <FormField label="Prénom" error={formState.errors.firstName?.message}>
                            <Input
                                {...register("firstName")}
                                placeholder="Louis"
                                className="text-sm text-black"
                            />
                        </FormField>

                        <FormField label="Pseudo" error={formState.errors.username?.message}>
                            <Input
                                {...register("username")}
                                placeholder="Pseudo"
                                className="text-sm text-black"
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-3 items-center">
                            <FormField label="Anniversaire" error={formState.errors.birthday?.message}>
                                <Input
                                    {...register("birthday")}
                                    type="date"
                                    className="text-sm text-gray-500 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                                />
                            </FormField>

                            <FormField label="Genre" error={formState.errors.gender?.message}>
                                <select
                                    {...register("gender")}
                                    className="text-sm text-white bg-gray-700 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                                >
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </FormField>
                        </div>
                        <FormField label="Réseaux sociaux" error="">
                            <div className="space-y-3">
                                <div className="relative">
                                    <Facebook
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                    <Input
                                        {...register("facebook")}
                                        placeholder="Lien vers ton Facebook"
                                        className="pl-10 text-sm text-black"
                                    />
                                    {formState.errors.facebook && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formState.errors.facebook.message}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <Instagram
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                    <Input
                                        {...register("instagram")}
                                        placeholder="Lien vers ton Instagram"
                                        className="pl-10 text-sm text-black"
                                    />
                                    {formState.errors.instagram && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formState.errors.instagram.message}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <Twitter
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                    <Input
                                        {...register("x")}
                                        placeholder="Lien vers ton X"
                                        className="pl-10 text-sm text-black"
                                    />
                                    {formState.errors.x && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formState.errors.x.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </FormField>

                        <FormField label="Mobile" error={formState.errors.phoneNumber?.message}>
                            <Input
                                {...register("phoneNumber")}
                                placeholder="06 06 06 06 06"
                                className="text-sm text-black"
                            />
                        </FormField>

                        <FormField label="Bio" error={formState.errors.bio?.message}>
                    <textarea
                        {...register("bio")}
                        rows={3}
                        className="w-full text-sm bg-gray-700 rounded-md p-2 text-white resize-none"
                    />
                        </FormField>

                        <Button
                            type="submit"
                            disabled={pending}
                            className="text-xs bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded-md flex items-center"
                        >
                            {pending ? "Chargement..." : "Modifier le profil"}
                        </Button>
                    </form>
                </div>

                <ProfilePictureSection
                    imageUrl="https://via.placeholder.com/150"
                    coverUrl="https://via.placeholder.com/150"
                    name="Utilisateur"
                />
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogOverlay/>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>Confirmez la mise à jour</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={handleDialogClose}>Annuler</Button>
                        <Button onClick={handleSubmit(handleConfirmUpdate)}>Confirmer</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
