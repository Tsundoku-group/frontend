'use client';

import React, {useState} from 'react';
import {DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel, AlertDialogTitle, AlertDialogDescription
} from '@/components/ui/alert-dialog';
import {addNewUserProfile} from "@/components/navbar/actions";
import {ShowToast} from "@/components/ShowToast";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutationState} from "@/hooks/useMutationState";
import {Profile} from "@/models/Profile";
import {CloudUpload} from "lucide-react";

const userProfileSchema = z.object({
    lastName: z
        .string()
        .optional()
        .refine(
            (val) => !val || (val.length >= 5 && val.length <= 25 && /^[a-zA-Z0-9_]+$/.test(val)),
            {
                message:
                    "Le nom de famille doit contenir entre 5 et 25 caractères et ne peut contenir que des lettres, chiffres et underscores",
            }
        ),
    firstName: z
        .string()
        .optional()
        .refine(
            (val) => !val || (val.length >= 5 && val.length <= 25 && /^[a-zA-Z0-9_]+$/.test(val)),
            {
                message:
                    "Le prénom doit contenir entre 5 et 25 caractères et ne peut contenir que des lettres, chiffres et underscores",
            }
        ),
    username: z
        .string()
        .min(5, "Le nom d'utilisateur doit contenir au moins 5 caractères")
        .max(25, "Le nom d'utilisateur ne peut pas dépasser 25 caractères")
        .regex(/^[a-zA-Z0-9_]+$/, "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"),
    type: z.enum(["lecteur", "auteur", "maison d'édition"]).default("lecteur"),
    birthday: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
            { message: "La date doit être au format AAAA-MM-JJ" }
        ),
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{10}$/.test(val),
            { message: "Le numéro de téléphone doit contenir 10 chiffres" }
        ),
    bio: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length <= 500,
            { message: "La bio ne doit pas dépasser 500 caractères" }
        ),
    profilePhoto: z.string().optional(),
    coverPhoto: z.string().optional(),
});

const StepperForm = ({onSuccess}: { onSuccess: () => void }) => {
    const [step, setStep] = useState(1);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const totalSteps = 3;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
        setValue,
        watch
    } = useForm<z.infer<typeof userProfileSchema>>({
        mode: 'onChange',
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            type: 'lecteur',
            profilePhoto: '',
            coverPhoto: '',
            birthday: '',
            phoneNumber: '',
            bio: '',
        },
    });

    const {mutate, pending} = useMutationState(async (payload: Profile) => {
        return await addNewUserProfile(payload);
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleConfirmSubmit = async (data: z.infer<typeof userProfileSchema>) => {
        try {
            await mutate(data);
            ShowToast('default', 'Profil créé avec succès!');
            reset();
            setIsAlertDialogOpen(false);
            onSuccess();
        } catch (error) {
            ShowToast('destructive', 'Une erreur est survenue. Veuillez réessayer.', 'Erreur');
            setIsAlertDialogOpen(false);
        }
    };

    return (
        <DialogContent className="max-w-[900px] w-full p-8 bg-tertiary-black border-none" style={{minHeight: '800px', maxHeight: '900px'}}>
            <DialogHeader>
                <DialogTitle>
                    <div className="text-xs">Créer un nouveau profil</div>
                </DialogTitle>
            </DialogHeader>
            <div className=" flex items-center p-2">
                <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                    <li
                        className={`flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 ${
                            step > 1 ? 'text-green-highlight dark:text-green-500' : step === 1 ? 'text-blue-600 dark:text-blue-500' : ''
                        }`}
                    >
                    <span className="flex items-center">
                        <span
                            className={`mr-2 flex items-center justify-center w-6 h-6 rounded-full font-semibold ${
                                step > 1 ? 'bg-green-highlight text-white' : 'bg-blue-600 text-white'
                            }`}
                        >
                            1
                        </span>
                        Informations personnelles
                    </span>
                    </li>
                    <li
                        className={`flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 ${
                            step > 2 ? 'text-green-highlight dark:text-green-500' : step === 2 ? 'text-blue-600 dark:text-blue-500' : ''
                        }`}
                    >
                <span className="flex items-center">
                     <span
                         className={`mr-2 flex items-center justify-center w-6 h-6 rounded-full font-semibold ${
                             step > 2 ? 'bg-green-highlight text-white' : 'bg-blue-600 text-white'
                         }`}
                     >
                            2
                        </span>
                    Détails
                </span>
                    </li>
                    <li
                        className={`flex items-center ${
                            step === 3 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500'
                        }`}
                    >
                        <span
                            className="mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-semibold">
                            3
                        </span>
                        Confirmation
                    </li>
                </ol>
            </div>

            <div className="relative h-96 w-full mb-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="h-12 flex items-center">
                            <h6 className="font-semibold text-white">Informations personnelles</h6>
                        </div>
                        <div className="text-xs text-gray-400">* Champ obligatoire</div>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-sm font-medium text-gray-400">
                                Nom de famille <span className="text-red-500"/>
                            </label>
                            <Input
                                {...register('lastName')}
                                placeholder="Dupond"
                                className={`bg-tertiary-black text-white border ${
                                    errors.lastName ? 'border-red-500' : watch('lastName') ? 'border-green-500' : 'border-gray-700'
                                } rounded-lg`}
                            />
                            {errors.lastName ? (
                                <div className="text-xs text-red-500 mt-1">{errors.lastName.message}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="Prénom" className="text-sm font-medium text-gray-400">
                                Prénom <span className="text-red-500"/>
                            </label>
                            <Input
                                {...register('firstName')}
                                placeholder="Louis"
                                className={`bg-tertiary-black text-white border ${
                                    errors.firstName ? 'border-red-500' : watch('firstName') ? 'border-green-500' : 'border-gray-700'
                                } rounded-lg`}
                            />
                            {errors.firstName ? (
                                <div className="text-xs text-red-500 mt-1">{errors.firstName.message}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-sm font-medium text-gray-400">
                                Nom d'utilisateur <span className="text-red-500">*</span>
                            </label>
                            <Input
                                {...register('username')}
                                placeholder="louis.la.brocante"
                                className={`bg-tertiary-black text-white border ${
                                    errors.username ? 'border-red-500' : watch('username') ? 'border-green-500' : 'border-gray-700'
                                } rounded-lg`}
                                aria-describedby="usernamenote"
                                required
                            />
                            {errors.username ? (
                                <div className="text-xs text-red-500 mt-1">{errors.username.message}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="type" className="text-sm font-medium text-gray-400">
                                Type de profil
                            </label>
                            <select
                                id="type"
                                {...register('type')}
                                className="p-2 bg-tertiary-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="lecteur">Lecteur</option>
                                <option value="auteur" disabled>
                                    ⚠️ Auteur (prochainement)
                                </option>
                                <option value="maison d'édition" disabled>
                                    ⚠️ Maison d'édition (prochainement)
                                </option>
                            </select>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4 flex flex-col justify-start">
                        <div className="h-12 flex items-center">
                            <h6 className="font-semibold text-white">Détails supplémentaires</h6>
                        </div>

                        <div className="flex items-center justify-center space-x-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                                    {watch('profilePhoto') ? (
                                        <img
                                            src={watch('profilePhoto')}
                                            alt="Photo de profil"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400 flex items-center justify-center h-full">
                                            Photo Profil
                                        </span>
                                    )}
                                </div>
                                <label className="mt-2 text-xs text-gray-400 cursor-pointer">
                                    Changer
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setValue('profilePhoto', URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <div
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6 bg-gray-800 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="coverPhoto"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setValue('coverPhoto', URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="coverPhoto"
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    <CloudUpload className="text-white cursor-pointer"/>
                                    <span className="text-gray-400 text-sm cursor-pointer">
                                        Glisse et dépose l&apos;image ici
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <Input
                                placeholder="Numéro de téléphone"
                                {...register('phoneNumber')}
                                className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                                    errors.phoneNumber ? 'border-red-500' : watch('phoneNumber') ? 'border-green-500' : 'border-gray-700'
                                } rounded-lg focus:outline-none focus:ring focus:ring-blue-500`}
                            />
                            {errors.phoneNumber ? (
                                <div className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</div>
                            ) : null}
                        </div>

                        <div>
                            <Input
                                type="date"
                                {...register('birthday')}
                                className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                                    errors.birthday ? 'border-red-500' : 'border-gray-500'
                                } rounded-lg focus:outline-none focus:ring focus:ring-blue-500`}
                            />
                            {errors.birthday ? (
                                <div className="text-xs text-red-500 mt-1">{errors.birthday.message}</div>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="bio" className="text-gray-400 text-sm mb-2 block">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                {...register('bio')}
                                placeholder="Parlez un peu de vous..."
                                className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                                    errors.bio ? 'border-red-500' : 'border-gray-500'
                                } rounded-lg focus:outline-none focus:ring focus:ring-blue-500`}
                            />
                            {errors.bio ? (
                                <div className="text-xs text-red-500 mt-1">{errors.bio.message}</div>) : null}
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-4 h-96 flex flex-col justify-start">
                        <div className="h-12 flex items-center">
                            <h6 className="font-semibold text-white">Résumé</h6>
                        </div>
                        <p className="text-sm text-gray-500">Vérifiez vos informations avant de soumettre.</p>

                        <div className="flex items-center justify-center space-x-8 mt-4">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                                    {watch("profilePhoto") ? (
                                        <img
                                            src={watch("profilePhoto")}
                                            alt="Photo de profil"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400 flex items-center justify-center h-full">
                                            Pas de photo de profil
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Photo de profil</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-700">
                                    {watch("coverPhoto") ? (
                                        <img
                                            src={watch("coverPhoto")}
                                            alt="Photo de couverture"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400 flex items-center justify-center h-full">
                                            Pas de photo de couverture
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Photo de couverture</p>
                            </div>
                        </div>

                        <ul className="list-disc pl-5 text-sm text-gray-400">
                            <li>
                                <span className="font-bold">Prénom :</span> {watch("firstName") || "Non renseigné"}
                            </li>
                            <li>
                                <span className="font-bold">Nom :</span> {watch("lastName") || "Non renseigné"}
                            </li>
                            <li>
                                <span
                                    className="font-bold">Nom d'utilisateur :</span> {watch("username") || "Non renseigné"}
                            </li>
                            <li>
                                <span
                                    className="font-bold">Date de naissance :</span> {watch("birthday") || "Non renseignée"}
                            </li>
                            <li>
                                <span
                                    className="font-bold">Numéro de téléphone :</span> {watch("phoneNumber") || "Non renseigné"}
                            </li>
                            <li>
                                <span className="font-bold">Type de profil :</span> {watch("type") || "Non renseigné"}
                            </li>
                            <li>
                                <span className="font-bold">Bio :</span> {watch("bio") || "Non renseignée"}
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                {step > 1 && (
                    <Button onClick={handlePrevious} className="bg-gray-500 hover:bg-gray-600">
                        Retour
                    </Button>
                )}
                {step < totalSteps ? (
                    <Button
                        onClick={handleNext}
                        className={`bg-purple-highlight ml-auto ${!watch("username") ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!watch("username")}
                    >
                        Suivant
                    </Button>
                ) : (
                    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="bg-green-highlight hover:bg-green-600 ml-auto"
                                disabled={pending}
                            >
                                Soumettre
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-tertiary-black border-none">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    <div className="text-lg">Confirmer la soumission</div>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="text-xs font-extralight">Voulez-vous vraiment soumettre ce profil?</div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-500 border-none">Annuler</AlertDialogCancel>
                                <AlertDialogAction>
                                    <Button
                                        onClick={handleSubmit(handleConfirmSubmit)}
                                        disabled={pending}
                                    >
                                        Confirmer
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </DialogContent>
    );
};

export default StepperForm;