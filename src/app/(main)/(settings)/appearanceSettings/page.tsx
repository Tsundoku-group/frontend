"use client";

import React, {useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {useMutationState} from "@/hooks/useMutationState";
import {ShowToast} from "@/components/ShowToast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

const saveFontPreference = async (font: string): Promise<string> => {
    localStorage.setItem("selectedFont", font);
    return font;
};

export default function AppearanceSettingsPage() {
    const [selectedTheme, setSelectedTheme] = useState("light");
    const savedFont = localStorage.getItem("selectedFont") || "font-roboto";
    const [selectedFont, setSelectedFont] = useState(savedFont);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const queryClient = useQueryClient();

    useEffect(() => {
        const savedFont = localStorage.getItem("selectedFont");
        if (savedFont) {
            setSelectedFont(savedFont);
        }
    }, []);

    const {mutate, pending} = useMutationState(async (font: string) => {
        const newFont = await saveFontPreference(font);
        queryClient.setQueryData(["fontPreference"], newFont);
        return newFont;
    });

    const handleConfirmUpdate = async () => {
        try {
            const newFont = await mutate(selectedFont);
            document.body.classList.remove("font-inter", "font-roboto", "font-poppins");
            document.body.classList.add(newFont);
            ShowToast('default', 'Vos préférences ont été mises à jour avec succès')
        } catch (error) {
            ShowToast('destructive', 'Erreur lors de la mise à jour des préférences', 'Erreur')
        } finally {
            setIsDialogOpen(false);
        }
    };

    const handleUpdateAppearance = () => {
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="flex items-start p-4">
                <div className="max-w-2xl w-full p-1 flex space-x-6">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-3xl font-semibold mb-8 text-white">Apparence</h3>
                            <p className="text-sm text-gray-400">
                                Personnaliser l&apos;apparence de l&apos;application. Basculer automatiquement entre les
                                thèmes du jour et de la nuit et sélectionnez la police de votre choix.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-white">Police</h4>
                                <p className="text-sm text-gray-400">
                                    Définissez la police que vous souhaitez utiliser dans le tableau de bord.
                                </p>
                            </div>
                            <Select
                                value={selectedFont}
                                onValueChange={(value) => setSelectedFont(value)}
                            >
                                <SelectTrigger
                                    className="w-60 text-gray-500 bg-gray-900 rounded-lg border border-gray-700">
                                    <SelectValue placeholder="Sélectionnez une police"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="font-inter">Inter</SelectItem>
                                    <SelectItem value="font-roboto">Roboto</SelectItem>
                                    <SelectItem value="font-poppins">Poppins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-white">Thème</h4>
                                <p className="text-sm text-gray-400">
                                    Sélectionnez le thème du tableau de bord.
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <Card
                                    onClick={() => setSelectedTheme("light")}
                                    className={`cursor-pointer ${selectedTheme === "light" ? "ring-2 ring-purple-600" : ""}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="w-40 h-20 bg-gray-100 rounded-lg"></div>
                                        <p className="text-center text-sm mt-2 text-gray-700">Light</p>
                                    </CardContent>
                                </Card>
                                <Card
                                    onClick={() => setSelectedTheme("dark")}
                                    className={`cursor-pointer ${selectedTheme === "dark" ? "ring-2 ring-purple-600" : ""}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="w-40 h-20 bg-gray-800 rounded-lg"></div>
                                        <p className="text-center text-sm mt-2 text-gray-300">Dark</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                onClick={handleUpdateAppearance}
                                disabled={pending}
                                className={`bg-purple-600 hover:bg-purple-700 text-white ${pending ? "opacity-50" : ""}`}
                            >
                                {pending ? "Mise à jour..." : "Mise à jour des préférences"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer les changements</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir appliquer ces changements ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmUpdate}
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
