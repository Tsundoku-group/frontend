'use client'

import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useAuthContext} from "@/context/authContext";
import {CircleCheckBig, CircleX} from "lucide-react";
import {fetchUpdatePwd, fetchVerifyPwd} from "@/app/(main)/(settings)/accountSettings/actions";
import {
    AlertDialog,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {ShowToast} from "@/components/ShowToast";

const PWD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function AccountSettingsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [currentPwd, setCurrentPwd] = useState<string>('');
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [pwd, setPwd] = useState<string>('');
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [matchPwd, setMatchPwd] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const {user} = useAuthContext();
    const userEmail = user?.email;

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v1 = PWD_REGEX.test(pwd);

        if (!v1) {
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }

        if (currentPwd === pwd) {
            ShowToast("destructive", "Erreur", "Le nouveau mot de passe ne peut pas être identique à l'ancien.");
            return;
        }

        setIsDialogOpen(true);
    }

    const handleConfirmUpdate = async () => {
        try {
            const verifyPassword = await fetchVerifyPwd(currentPwd);

            if (400 === verifyPassword.status) {
                ShowToast("destructive", "Erreur", "L'ancien mot de passe est incorrect" );
                return;
            }

            const updatePassword = await fetchUpdatePwd(pwd);

            if (200 === updatePassword.status) {
                ShowToast("default", "Mot de passe changé avec succès !", "");

                setCurrentPwd('');
                setPwd('');
                setMatchPwd('');
            } else {
                ShowToast("destructive", "Erreur", "Erreur lors de la mise à jour du mot de passe." );
            }

            setIsDialogOpen(false);

        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            setIsDialogOpen(false);
            ShowToast("destructive", "Erreur", errorMessage);
        }
    };

    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-semibold mb-8 text-white">Comptes</h1>

                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Information du compte</h2>
                        <div
                            className={`border border-dashed ${user?.isVerified ? 'border-green-600' : 'border-purple-600'} p-4 rounded-lg mb-4`}>
                            <p className={`text-sm ${user?.isVerified ? 'text-gray-400' : 'text-gray-400'}`}>
                                {user?.isVerified
                                    ? "Votre adresse électronique est vérifiée. Vous pouvez maintenant publier un post et effectuer d'autres actions."
                                    : "Vous n’avez pas vérifié votre adresse électronique ! Pour publier un post et effectuer d’autres actions, veuillez vérifier votre adresse électronique."
                                }
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-white">Email</label>
                            <Input
                                id="email"
                                type="email"
                                value={userEmail || ""}
                                readOnly
                                className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                style={{width: "300px"}}
                            />
                        </div>
                    </Card>

                    <Card className="p-6 mb-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Modifier le mot de passe</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current-pwd" className="text-sm text-white">Mot de passe
                                        actuel</label>
                                    <Input
                                        id="current-pwd"
                                        type="password"
                                        placeholder="mdp123!"
                                        onChange={(e) => setCurrentPwd(e.target.value)}
                                        className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        style={{ width: "300px" }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-pwd" className="text-sm text-white">Nouveau mot de passe</label>
                                    <span className={validPwd ? "text-green-500 ml-2" : "hidden"}>
                                        <CircleCheckBig size={20} />
                                    </span>
                                    <span className={validPwd || !pwd ? "hidden" : "text-red-500 ml-2"}>
                                        <CircleX size={20} />
                                    </span>
                                    <Input
                                        id="new-pwd"
                                        type="password"
                                        placeholder="mdp123!"
                                        onChange={(e) => setPwd(e.target.value)}
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        style={{ width: "300px" }}
                                    />
                                    <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "text-red-500" : "hidden"}>
                                        1. Le mot de passe doit contenir au moins une lettre minuscule.<br />
                                        2. Le mot de passe doit contenir au moins une lettre majuscule.<br />
                                        3. Le mot de passe doit contenir au moins un chiffre.<br />
                                        4. Le mot de passe doit contenir au moins un des caractères spéciaux suivants :
                                        !@#$%.<br />
                                        5. Le mot de passe doit avoir une longueur comprise entre 8 et 24 caractères.<br />
                                    </p>
                                </div>
                                <div>
                                    <label htmlFor="matchPwd" className="text-sm text-white">Confirmer le nouveau mot de passe</label>
                                    <span className={validMatch && matchPwd ? "text-green-500 ml-2" : "hidden"}>
                                        <CircleCheckBig size={20} />
                                    </span>
                                    <span className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-2"}>
                                        <CircleX size={20} />
                                    </span>
                                    <Input
                                        id="matchPwd"
                                        type="password"
                                        placeholder="mdp123!"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="matchnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        style={{ width: "300px" }}
                                    />
                                    <p id="matchnote" className={matchFocus && matchPwd && !validMatch ? "text-red-500" : "hidden"}>
                                        Les mots de passe ne correspondent pas.<br />
                                        Veuillez vous assurer que les deux mots de passe sont identiques.
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={!validPwd || !validMatch}
                                className={`mt-4 p-2 rounded px-6 ${
                                    !validPwd || !validMatch
                                        ? "bg-purple-600 text-white cursor-not-allowed "
                                        : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}>Modifier</Button>
                        </form>
                    </Card>

                    <Card className="p-6 rounded-lg bg-secondary-black border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Suppression du compte</h2>
                        <div className="border border-dashed border-red-500 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-400">
                                Attention : Cette action est irréversible. La suppression de votre compte entraînera
                                la perte de toutes vos données.
                            </p>
                        </div>
                        <Button className="bg-red-500 hover:bg-red-600 text-white">Supprimer</Button>
                    </Card>

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogOverlay />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer le changement de mot de passe</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir modifier votre mot de passe ?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="mr-2"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={handleConfirmUpdate}
                                >
                                    Confirmer
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};