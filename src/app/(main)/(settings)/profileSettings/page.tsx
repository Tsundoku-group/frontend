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
import {AlertCircle, Facebook, Instagram, Loader2, Twitter} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useAuthContext} from "@/context/authContext";
import {ShowToast} from "@/components/ShowToast";
import {storage} from "../../../../../firebaseConfig";
import {deleteObject, getDownloadURL, listAll, ref} from "@firebase/storage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/croppedImg";

interface ImageProps {
    currentAvatar: string | null;
    preview: string | null;
    name: string;
}

type ProfilePictureSectionProps = {
    imageUrl: string;
    name: string;
    onPreviewComplete: (url: string) => void;
}

interface ImageCropDialogProps {
    firebasePath: string;
    isOpen: boolean;
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

const ImageFromLocalStorage: React.FC<ImageProps> = ({currentAvatar, preview}) => {
    const {activeProfileInStorage, profileImageUrls, refreshProfileImage} = useProfileContext();
    const [isCropDialogOpen, setIsCropDialogOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const profileId = activeProfileInStorage?.id || "";
        setImageUrl(profileImageUrls[profileId] || preview || currentAvatar || "");
    }, [profileImageUrls, activeProfileInStorage, preview, currentAvatar]);

    const handleCropComplete = async (croppedImage: Blob) => {
        const formData = new FormData();
        formData.append("file", croppedImage);
        formData.append("profileId", activeProfileInStorage?.id || "");

        try {
            const response = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                refreshProfileImage(activeProfileInStorage?.id || "");
                setIsCropDialogOpen(false);
            }
        } catch (error) {
            ShowToast("destructive", "Erreur lors de l'upload.", "Erreur");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center space-y-3">
                <h4 className="text-base font-semibold mb-2">Photo de profil</h4>
                <div onClick={() => setIsCropDialogOpen(true)} className="cursor-pointer">
                    <Avatar className="w-40 h-40 border-2 border-gray-300 hover:border-blue-500 transition-all">
                        <AvatarImage
                            src={imageUrl}
                            alt={activeProfileInStorage?.username || "Profile Image"}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/default-avatar.png";
                            }}
                            className="object-cover object-center"
                        />
                        <AvatarFallback>150 x150</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <ImageCropDialog
                firebasePath={imageUrl}
                isOpen={isCropDialogOpen}
                onClose={() => setIsCropDialogOpen(false)}
                onCropComplete={handleCropComplete}
            />
        </>
    );
};

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({firebasePath, isOpen, onClose, onCropComplete}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const {activeProfileInStorage, refreshProfileImage} = useProfileContext();
    const {user} = useAuthContext();
    const profileId = activeProfileInStorage?.id || "";
    const userId = user?.userId || 0;

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
            const croppedFile = new File([croppedImageBlob], "cropped-image.jpg", {type: "image/jpeg"});

            await handleUploadNewImage({
                file: croppedFile,
                profileId,
                userId,
                type: "profile",
                onUploadSuccess: () => {
                    refreshProfileImage(profileId);
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
                            aspect={1}
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

async function handleUploadNewImage({file, profileId, userId, type = "profile", onUploadSuccess, onError, setLoading}: {
    file: File;
    profileId: string;
    userId: string;
    type?: string;
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
        formData.append("profileId", profileId);
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

const ProfilePictureSection = React.memo(({imageUrl, name}: ProfilePictureSectionProps) => {
    const [uploading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [preview, setPreview] = useState<string>(imageUrl);
    const [tempPreview, setTempPreview] = useState<string | null>(imageUrl);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentAvatar, setCurrentAvatar] = useState<string>(imageUrl || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {user} = useAuthContext();
    const userId = user?.userId as string;
    const {activeProfileInStorage, refreshProfileImage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as string;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type) || file.size > 2 * 1024 * 1024) {
            setErrorMessage(
                !allowedTypes.includes(file.type)
                    ? "Seuls les fichiers JPEG et PNG sont acceptés."
                    : "Le fichier est trop volumineux. Taille maximale : 2 Mo."
            );
            return;
        }

        setTempPreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setErrorMessage(null);
    };

    const handleCancelUpdatePicture = () => {
        setTempPreview(null);
        setSelectedFile(null);
        setErrorMessage(null);
        setPreview(imageUrl);
        setIsDialogOpen(false);
    };

    const UploadedImagesList = ({userId, profileId}: { userId: string, profileId: string }) => {
        const [images, setImages] = useState<{ url: string; type: string }[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        useEffect(() => {
            const fetchImages = async () => {
                if (!profileId) return;

                try {
                    setIsLoading(true);
                    setErrorMessage(null);

                    const folderRef = ref(storage, `profilePictures/${profileId}`);
                    const result = await listAll(folderRef);

                    const urls = await Promise.all(
                        result.items.map(async (item) => {
                            const url = await getDownloadURL(item);
                            const type = item.fullPath.startsWith(`profilePictures/`) ? "profile" : "cover";

                            return {url, type};
                        })
                    );

                    setImages(urls);
                } catch (error) {
                    console.log(error);
                    ShowToast("destructive", "Impossible de charger les photo de profils", "Erreur");
                } finally {
                    setIsLoading(false);
                }
            }

            fetchImages();
        }, [profileId]);

        const handleDeleteImage = async (url: string, type: string) => {
            try {
                setIsDeleting(true);

                const path = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);
                const imageRef = ref(storage, path);

                await deleteObject(imageRef);

                const symfonyResponse = await deleteUserProfilePictureUrl(userId, profileId, url, type);

                if (!symfonyResponse) {
                    ShowToast("destructive", "Erreur lors de la suppression de l'image.", "Erreur");
                }

                ShowToast("default", "Image supprimée");

                const folderRef = ref(storage, `profilePictures/${profileId}`);
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
            } finally {
                setIsDeleting(false);
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

    return (
        <>
            <div className="flex flex-col items-center">
                <ImageFromLocalStorage currentAvatar={currentAvatar} preview={preview} name={name}/>
                <Button
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md mt-4"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Modifier
                </Button>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogOverlay/>
                <AlertDialogContent className="max-w-2xl w-full bg-tertiary-black border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Changer la photo de Profil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Voulez-vous vraiment changer votre photo de profil ?
                        </AlertDialogDescription>
                        {errorMessage && (
                            <Alert variant="destructive" className="border-red-500 text-red-500 mt-4">
                                <AlertCircle className="h-4 w-4 text-red-500"/>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-black"/>
                            </div>
                        ) : null}

                        <div className="flex flex-col items-center space-y-3 mb-4">
                            {tempPreview ? (
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={tempPreview} className="object-cover object-center"/>
                                    <AvatarFallback/>
                                </Avatar>
                            ) : (
                                <ImageFromLocalStorage currentAvatar={currentAvatar} preview={preview} name={name}/>
                            )}
                        </div>

                        <UploadedImagesList userId={userId} profileId={profileId}/>

                        <Input
                            id="profile-upload"
                            type="file"
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleFileChange}
                        />
                        <div>Recommandé: La taille de l&apos;image doit faire <strong>150x150</strong></div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={handleCancelUpdatePicture}
                                className="mr-2 bg-gray-500 border-none">
                            Annuler
                        </Button>
                        <label htmlFor="profile-upload" className="cursor-pointer">
                            <Button
                                className="bg-purple-highlight hover:bg-purple-700 text-white"
                                disabled={uploading}
                                onClick={async () => {
                                    if (!selectedFile) {
                                        ShowToast("destructive", "Veuillez sélectionner une photo avant de confirmer.", "Erreur");
                                        return;
                                    }

                                    await handleUploadNewImage({
                                        file: selectedFile,
                                        profileId,
                                        userId,
                                        type: "profile",
                                        onUploadSuccess: (url) => {
                                            setPreview(url);
                                            setCurrentAvatar(url);
                                            refreshProfileImage(profileId);
                                            setIsDialogOpen(false);
                                        },
                                        onError: (message) => setErrorMessage(message),
                                        setLoading: setIsLoading,
                                    });
                                }}
                            >
                                Confirmer
                            </Button>
                        </label>
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
    const profileId = activeProfileInStorage?.id as string;

    const {mutate, pending} = useMutationState(async (updatedProfile: Profile) => {
        return await updateUserProfileData(profileId, updatedProfile);
    });

    const fetchUserProfile = useCallback(async () => {
        if (!profileId) return;

        const genderMap: Record<string, string> = {
            male: "Masculin",
            female: "Féminin",
            other: "Autre",
        };

        try {
            const data: Profile = await fetchUserProfileData(profileId);
            setProfile({...data, gender: genderMap[data.gender as string] || "Autre"});
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [profileId]);


    const reverseGenderMap: Record<string, string> = {
        male: "Masculin",
        female: "Féminin",
        other: "Autre",
    };

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
            const transformedData = {...data, gender: reverseGenderMap[data.gender as string || "other"]};
            const updatedProfile = await mutate(transformedData);
            setProfile(updatedProfile);
            handleDialogClose();
            await fetchUserProfile();
        } catch (err) {
            console.error("Error updating profile:", err);
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
                    name="Utilisateur"
                    onPreviewComplete={() => console.log("Modifier")}
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
