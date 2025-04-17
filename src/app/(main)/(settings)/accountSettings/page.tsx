'use client'

import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useAuthContext} from "@/context/authContext";
import {AlertCircle, CircleCheckBig, CircleX, Eye, EyeOff} from "lucide-react";
import {fetchDeletePwd, fetchUpdatePwd, fetchVerifyPwd} from "@/server-actions/main/settings/actions";
import {
    AlertDialog,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {ShowToast} from "@/components/ShowToast";
import {Alert, AlertDescription} from "@/components/ui/alert";
import Captcha from "@/components/captcha/UpdatePasswordCaptcha";
import {deleteSession} from "@/app/_lib/session";

const PWD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function AccountSettingsPage() {
    const {setIsAuthenticated, setUser} = useAuthContext();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [currentPwd, setCurrentPwd] = useState<string>('');
    const [actionType, setActionType] = useState<"update" | "delete" | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaKey, setCaptchaKey] = useState(0);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [pwd, setPwd] = useState<string>('');
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [matchPwd, setMatchPwd] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {user} = useAuthContext();
    const userEmail = user?.email;
    const userId = user?.userId;

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
            ShowToast("destructive", "Le nouveau mot de passe ne peut pas être identique à l'ancien.", "Erreur");
            return;
        }

        setActionType("update");
        setIsDialogOpen(true);
    }

    const handleConfirmAction = async () => {
        try {
            if ("update" === actionType) {

                if (!captchaToken) {
                    ShowToast("destructive", "Veuillez résoudre le captcha pour continuer.", "Erreur");
                    return;
                }

                const verifyPassword = await fetchVerifyPwd(currentPwd);

                if (400 === verifyPassword.status) {
                    ShowToast("destructive", "L'ancien mot de passe est incorrect", "Erreur");
                    return;
                }

                const updatePassword = await fetchUpdatePwd({newPassword: pwd, captchaToken});

                if (200 === updatePassword.status) {
                    ShowToast("default", "Mot de passe changé avec succès !", "");
                    setCurrentPwd('');
                    setPwd('');
                    setMatchPwd('');
                    setCaptchaToken(null);
                    setCaptchaKey((prevKey) => prevKey + 1);
                } else {
                    ShowToast("destructive", "Erreur lors de la mise à jour du mot de passe.", "Erreur");
                }
            } else if ("delete" === actionType) {
                const deleteAccountRequest = await fetchDeletePwd(userId)

                if (200 === deleteAccountRequest.status) {
                    ShowToast("default", "Votre demande de supprimer a bien été confirmé. Le compte sera supprimé sous un délai de 30 jours");

                    await deleteSession();
                    setIsAuthenticated(false);
                    setUser(null);
                } else if (400 === deleteAccountRequest.status) {
                    ShowToast("destructive", "Votre demande a déjà été effectué pour la supression du compte", "Erreur")
                } else {
                    ShowToast("destructive", "Erreur lors de la suppression du compte.", "Erreur");
                }
            }

            setIsDialogOpen(false);
        } catch (error) {
            const errorMessage = (error as Error).message || "Il y a eu un problème avec votre demande.";

            setIsDialogOpen(false);
            ShowToast("destructive", errorMessage, "Erreur");
        }
    };

    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-semibold mb-8 text-white">Comptes</h3>

                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 text-white">Information du compte</h4>
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
                        <div className="relative">
                            <h4 className="text-lg font-semibold mb-4 text-white">Modifier le mot de passe</h4>
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff/> : <Eye/>}
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="current-pwd" className="text-sm text-white">Mot de passe
                                        actuel</label>
                                    <Input
                                        id="current-pwd"
                                        type={showPassword ? "text" : "password"}
                                        value={currentPwd}
                                        placeholder="mdp123!"
                                        onChange={(e) => setCurrentPwd(e.target.value)}
                                        className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        style={{width: "300px"}}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="new-pwd" className="text-sm text-white">Nouveau mot de passe</label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="new-pwd"
                                            type={showPassword ? "text" : "password"}
                                            value={pwd}
                                            placeholder="mdp123!"
                                            onChange={(e) => setPwd(e.target.value)}
                                            aria-invalid={validPwd ? "false" : "true"}
                                            aria-describedby="pwdnote"
                                            onFocus={() => setPwdFocus(true)}
                                            onBlur={() => setPwdFocus(false)}
                                            className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            style={{width: "300px"}}
                                        />
                                        <span
                                            className={validPwd ? "text-green-500 self-center" : "hidden"}>
                                            <CircleCheckBig size={25}/>
                                        </span>
                                        <span className={validPwd || !pwd ? "hidden" : "text-red-500 self-center"}>
                                            <CircleX size={25}/>
                                        </span>
                                    </div>
                                    <Alert variant="destructive" id="matchnote"
                                           className={pwdFocus && pwd && !validPwd ? "border-red-highlight text-red-highlight" : "hidden"}>
                                        <AlertCircle className="h-4 w-4 red-highlight"/>
                                        <AlertDescription>
                                            1. Le mot de passe doit contenir au moins une lettre minuscule.<br/>
                                            2. Le mot de passe doit contenir au moins une lettre majuscule.<br/>
                                            3. Le mot de passe doit contenir au moins un chiffre.<br/>
                                            4. Le mot de passe doit contenir au moins un des caractères spéciaux
                                            suivants :
                                            !@#$%.<br/>
                                            5. Le mot de passe doit avoir une longueur comprise entre 8 et 24
                                            caractères.<br/>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="matchPwd" className="text-sm text-white">Confirmer le nouveau mot de
                                        passe</label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="matchPwd"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="mdp123!"
                                            value={matchPwd}
                                            onChange={(e) => setMatchPwd(e.target.value)}
                                            required
                                            aria-invalid={validMatch ? "false" : "true"}
                                            aria-describedby="matchnote"
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)}
                                            className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            style={{width: "300px"}}
                                        />
                                        <span
                                            className={validMatch && matchPwd ? "text-green-500 self-center" : "hidden"}>
                                        <CircleCheckBig size={25}/>
                                    </span>
                                        <span
                                            className={validMatch || !matchPwd ? "hidden" : "text-red-500 self-center"}>
                                        <CircleX size={25}/>
                                    </span>
                                    </div>
                                    <Alert variant="destructive" id="matchnote"
                                           className={matchFocus && matchPwd && !validMatch ? "border-red-highlight text-red-highlight" : "hidden"}>
                                        <AlertCircle className="h-4 w-4 red-highlight"/>
                                        <AlertDescription>
                                            Les mots de passe ne correspondent pas.<br/>
                                            Veuillez vous assurer que les deux mots de passe sont identiques.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <Captcha
                                    key={captchaKey}
                                    siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                    onVerify={(token) => setCaptchaToken(token)}
                                    onExpire={() => {
                                        setCaptchaToken(null);
                                        ShowToast("destructive", "Le captcha a expiré. Veuillez réessayer.", "Erreur");
                                    }}
                                    onError={() => {
                                        ShowToast("destructive", "Une erreur s'est produite avec le captcha.", "Erreur");
                                    }}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!validPwd || !validMatch || !captchaToken}
                                className={`mt-4 p-2 rounded px-6 ${
                                    !validPwd || !validMatch
                                        ? "bg-purple-600 text-white cursor-not-allowed "
                                        : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}>Modifier</Button>
                        </form>
                    </Card>

                    <Card className="p-6 rounded-lg bg-secondary-black border border-gray-700">
                        <h4 className="text-lg font-semibold mb-4 text-white">Suppression du compte</h4>
                        <div className="border border-dashed border-red-500 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-400">
                                Attention : Cette action est irréversible. La suppression de votre compte entraînera
                                la perte de toutes vos données.
                            </p>
                        </div>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => {
                                setActionType("delete");
                                setIsDialogOpen(true);
                            }}
                        >
                            Supprimer
                        </Button>
                    </Card>

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogOverlay/>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {"delete" === actionType
                                        ? "Confirmer la suppression du compte"
                                        : "Confirmer le changement de mot de passe"
                                    }
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {"delete" === actionType
                                        ? "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
                                        : "Êtes-vous sûr de vouloir modifier votre mot de passe ?"
                                    }
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
                                    className={actionType === "delete"
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-purple-600 hover:bg-purple-700 text-white"}
                                    onClick={handleConfirmAction}
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
