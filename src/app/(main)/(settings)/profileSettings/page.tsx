'use client';

import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Facebook, Instagram, Twitter} from "lucide-react";
import {Profile} from "@/models/Profile";
import {useAuthContext} from "@/context/authContext";
import {
    fetchUserProfileData,
    updateUserProfileData,
} from "@/app/(main)/(settings)/profileSettings/actions";
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
import Image from "next/image";

const ProfileSchema = z.object({
    lastName: z.string().min(5, "Le nom de famille doit contenir au moins 5 caractères").max(25, "Le nom de famille ne peut pas dépasser 25 caractères"),
    firstName: z.string().min(5, "Le prénom doit contenir au moins 5 caractères").max(25, "Le prénom ne peut pas dépasser 25 caractères"),
    username: z.string().min(5, "Le nom d'utilisateur doit contenir au moins 5 caractères").max(25, "Le nom d'utilisateur ne peut pas dépasser 25 caractères"),
    birthday: z.string().optional(),
    gender: z.enum(["Masculin", "Féminin", "Autre"]).optional(),
    phoneNumber: z.string().regex(/^\d{10}$/, "Le numéro de téléphone doit contenir 10 chiffres"),
    bio: z.string().max(500, "La bio ne doit pas dépasser 500 caractères").optional(),
    facebook: z.string().url("Lien Facebook invalide").optional(),
    instagram: z.string().url("Lien Instagram invalide").optional(),
    x: z.string().url("Lien X invalide").optional(),
});

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {user} = useAuthContext();
    const userId = user?.userId as string;

    const {mutate, pending} = useMutationState(async (updatedProfile: Profile) => {
        return await updateUserProfileData(userId, updatedProfile);
    });

    const fetchUserProfile = useCallback(async () => {
        if (!userId) return;

        const genderMap: Record<string, string> = {
            male: "Masculin",
            female: "Féminin",
            other: "Autre",
        };

        try {
            const data: Profile = await fetchUserProfileData(userId);

            const transformedProfile = {
                ...data,
                gender: genderMap[data.gender || "other"],
            };

            setProfile(transformedProfile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [userId]);

    const reverseGenderMap: Record<string, string> = {
        Masculin: "male",
        Féminin: "female",
        Autre: "other",
    };

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const {register, handleSubmit, reset, formState} = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: sanitizeProfile(profile),
    });

    useEffect(() => {
        if (profile) {
            reset(sanitizeProfile(profile));
        }
    }, [profile, reset]);

    const handleDialogOpen = () => setIsDialogOpen(true);
    const handleDialogClose = () => setIsDialogOpen(false);

    const handleConfirmUpdate = async (data: z.infer<typeof ProfileSchema>) => {
        try {
            const transformedData = {
                ...data,
                gender: reverseGenderMap[data.gender || "other"],
            };
            const updatedProfile = await mutate(transformedData);
            setProfile(updatedProfile);
            handleDialogClose();

            await fetchUserProfile();
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    function sanitizeProfile(profile: Profile | null): z.infer<typeof ProfileSchema> | {} {
        if (!profile) return {};
        return {
            ...profile,
            birthday: profile.birthday || undefined,
        };
    }

    return (
        <div className="flex items-start p-4 text-white">
            <div className="max-w-3xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-semibold mb-8">Profil</h3>

                    <form onSubmit={handleSubmit(() => handleDialogOpen())}>
                        <div className="space-y-1">
                            <label className="text-sm">Nom</label>
                            <Input
                                placeholder="Dupont"
                                {...register("lastName")}
                                className="text-sm text-black"
                            />
                            {formState.errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Prénom</label>
                            <Input
                                placeholder="Louis"
                                {...register("firstName")}
                                className="text-sm text-black"
                            />
                            {formState.errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Pseudo</label>
                            <Input
                                placeholder="Louis.la.brocante"
                                {...register("username")}
                                className="text-sm text-black"
                            />
                            {formState.errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center">
                            <div className="space-y-1">
                                <label className="text-sm">Anniversaire</label>
                                <Input
                                    type="date"
                                    {...register("birthday")}
                                    className="text-sm text-gray-500 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                                />
                                {formState.errors.birthday && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formState.errors.birthday.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm">Genre</label>
                                <select
                                    {...register("gender")}
                                    className="text-sm text-text-white bg-gray-700 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                                >
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                    <option value="Autre">Autre</option>
                                </select>
                                {formState.errors.gender && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formState.errors.gender.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Mobile</label>
                            <Input
                                placeholder="06 06 06 06 06"
                                {...register("phoneNumber")}
                                className="text-sm text-black"
                            />
                            {formState.errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Réseaux sociaux</label>
                            <div className="relative">
                                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                <Input
                                    placeholder="Lien vers ton Facebook"
                                    {...register("facebook")}
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
                                    placeholder="Lien vers ton Instagram"
                                    {...register("instagram")}
                                    className="pl-10 text-sm text-black"
                                />
                                {formState.errors.instagram && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formState.errors.instagram.message}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                <Input
                                    placeholder="Lien vers ton X"
                                    {...register("x")}
                                    className="pl-10 text-sm text-black"
                                />
                                {formState.errors.x && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formState.errors.x.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Bio</label>
                            <textarea
                                placeholder="Je suis une bio, chouette !"
                                {...register("bio")}
                                className="w-full text-sm bg-gray-700 rounded-md p-2 text-white resize-none"
                                rows={3}
                            ></textarea>
                            {formState.errors.bio && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.bio.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={pending}
                            className="text-xs bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded-md flex items-center"
                        >
                            {pending ? "Chargement..." : "Modifier le profil"}
                        </Button>
                    </form>
                </div>
                <div className="w-1/4 flex flex-col items-center space-y-3">
                    <h4 className="text-base font-semibold mb-2">Photo de profil</h4>
                    <div className="w-40 h-auto rounded-full overflow-hidden mb-2">
                        <Image
                            src="https://ui-avatars.com/api/?name=Louis+Dupont&background=4F46E5&color=fff"
                            alt="Profile"
                            className="w-full h-full object-cover"
                            width={160}
                            height={160}
                        />
                    </div>
                    <Button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center">
                        <span>Modifier</span>
                    </Button>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogOverlay/>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir modifier les informations de votre profil ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={handleDialogClose} className="mr-2">
                            Annuler
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handleSubmit(handleConfirmUpdate)}
                        >
                            Confirmer
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}