'use client'

import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";
import {useMutationState} from "@/hooks/useMutationState";
import {useQueryClient} from "@tanstack/react-query";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {ShowToast} from "@/components/ShowToast";

const savePreferences = async ({isHighContrast, textSize}: { isHighContrast: boolean; textSize: number }) => {
    localStorage.setItem("selectedHighContrast", JSON.stringify(isHighContrast));
    localStorage.setItem("selectedTextSize", JSON.stringify(textSize));
    return {isHighContrast, textSize};
};

export default function AccessibilitySettingsPage() {
    const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
    const [textSize, setTextSize] = useState<number>(16);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<"save" | "reset" | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        const savedHighContrast = localStorage.getItem("selectedHighContrast");
        const savedTextSize = localStorage.getItem("selectedTextSize");

        if (null !== savedHighContrast) {
            setIsHighContrast(JSON.parse(savedHighContrast));
        }

        if (null !== savedTextSize) {
            setTextSize(parseInt(savedTextSize, 10));
        }
    }, []);

    useEffect(() => {
        if (isHighContrast) {
            document.body.classList.add("high-contrast");
        } else {
            document.body.classList.remove("high-contrast");
        }

        return () => {
            document.body.classList.remove("high-contrast");
        };
    }, [isHighContrast]);


    useEffect(() => {
        document.documentElement.style.setProperty("--text-size", `${textSize}px`);
    }, [textSize]);

    const {mutate, pending} = useMutationState(
        async ({isHighContrast, textSize}: { isHighContrast: boolean; textSize: number }) => {
            const updatedPreferences = await savePreferences({isHighContrast, textSize});
            queryClient.setQueryData(["accessibilityPreferences"], updatedPreferences);
            return updatedPreferences;
        }
    );

    const handleConfirmUpdate = async () => {
        try {
            const updatedPreferences = await mutate({isHighContrast, textSize});
            if (updatedPreferences.isHighContrast) {
                document.body.classList.add("high-contrast");
            } else {
                document.body.classList.remove("high-contrast");
            }
            document.documentElement.style.setProperty("--text-size", `${updatedPreferences.textSize}px`);
            setTextSize(updatedPreferences.textSize);
            ShowToast("default", "Vos préférences ont été mises à jour avec succès");
        } catch (error) {
            ShowToast("destructive", "Erreur lors de la mise à jour des préférences", "Erreur");
        } finally {
            setIsDialogOpen(false);
        }
    };

    const handleToggleHighContrast = (checked: boolean) => {
        setIsHighContrast(checked);
    };

    const handleSliderChange = (value: number[]) => {
        const newSize = value[0];
        setTextSize(newSize);
    };

    const handleUpdateAccessibility = () => {
        setDialogAction("save");
        setIsDialogOpen(true);
    };

    const handleResetPreferences = () => {
        setDialogAction("reset");
        setIsDialogOpen(true);
    };

    const confirmResetPreferences = () => {
        const defaultHighContrast = false;
        const defaultTextSize = 16;

        setIsHighContrast(defaultHighContrast);
        setTextSize(defaultTextSize);

        localStorage.setItem("selectedHighContrast", JSON.stringify(defaultHighContrast));
        localStorage.setItem("selectedTextSize", JSON.stringify(defaultTextSize));

        document.body.classList.remove("high-contrast");
        document.documentElement.style.setProperty("--text-size", `${defaultTextSize}px`);

        ShowToast("default", "Préférences réinitialisées avec succès");
    };

    return (
        <>
            <div className="flex items-start p-4">
                <div className="max-w-2xl w-full p-1 flex space-x-6">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-3xl font-bold text-white">Accessibilités</h3>
                        <p className="text-sm text-gray-400">
                            Personnalisez les paramètres pour améliorer l&apos;accessibilité et l&apos;expérience
                            utilisateur dans
                            l&apos;application.
                        </p>

                        <Card className="bg-secondary-black rounded-lg border border-gray-700">
                            <CardHeader>
                                <h4 className="text-xl font-semibold text-white">Contraste élevé</h4>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400 mb-4">
                                    Activez le mode contraste élevé pour une meilleure lisibilité.
                                </p>
                                <Switch checked={isHighContrast} onCheckedChange={handleToggleHighContrast}/>
                            </CardContent>
                        </Card>

                        <Card className="bg-secondary-black rounded-lg border border-gray-700">
                            <CardHeader>
                                <h4 className="text-xl font-semibold text-white">Taille du texte</h4>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400 mb-4">
                                    Ajustez la taille du texte dans l&apos;application.
                                </p>
                                <Slider value={[textSize]} max={20} min={13} step={1}
                                        onValueChange={handleSliderChange}/>
                            </CardContent>
                        </Card>

                        <div className="space-x-4">
                            <Button
                                onClick={handleUpdateAccessibility}
                                disabled={pending}
                                className="bg-purple-600 hover:bg-purple-700 text-white">
                                {pending ? "Mise à jour..." : "Mise à jour des préférences"}
                            </Button>

                            <Button
                                onClick={() => handleResetPreferences()}
                                className="bg-gray-600 hover:bg-gray-700 text-white mt-4"
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dialogAction === "reset" ? "Confirmer la réinitialisation" : "Confirmer les changements"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogAction === "reset"
                                ? "Êtes-vous sûr de vouloir réinitialiser vos préférences ? Cette action remettra tout par défaut."
                                : "Êtes-vous sûr de vouloir appliquer ces changements ?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={dialogAction === "reset" ? confirmResetPreferences : handleConfirmUpdate}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};