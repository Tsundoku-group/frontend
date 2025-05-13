'use client'

import React, {useEffect, useRef, useState} from "react";
import {CircleCheckBig, CircleX, Command, Lock, User} from "lucide-react";
import {useRouter} from "next/navigation";
import {HandleRegister} from "@/server-actions/auth/register/actions";
import Image from "next/image";
import {Alert, AlertDescription} from "@/components/ui/alert";

const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.{8,24}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export default function RegisterPage() {
    const errRef = useRef<HTMLParagraphElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState<string>('');
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);

    const [pwd, setPwd] = useState<string>('');
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [matchPwd, setMatchPwd] = useState<string>('');
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string | null>('');
    const [success, setSuccess] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation1 = EMAIL_REGEX.test(email);
        const validation2 = PWD_REGEX.test(pwd);

        if (!validation1 || !validation2) {
            setErrMsg("Entrée invalide");
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }

        const response = await HandleRegister(email, pwd);

        if (response.success) {
            setSuccess(true);
        } else {
            setErrMsg(response.error || null);
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    const handlePrivacyPolicyRedirect = () => {
        router.push('/policy/privacy-policy');
    };

    const handleTermsRedirect = () => {
        router.push('/policy/terms-of-service');
    };

    return (
        <>
            {success ? (
                router.push('/')
            ) : (
                <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-tertiary-black text-text-white">
                    <div className="hidden lg:flex items-end justify-start bg-secondary-black relative p-12">
                        <div className="absolute top-16 left-8 flex items-center space-x-2 z-20">
                            <Command className="w-6 h-6 text-pink-100"/>
                            <h4 className="text-lg font-bold text-pink-100">Tsundoku</h4>
                        </div>
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <Image
                                src="/illustration-tsundoku-auth.png"
                                alt="image login"
                                width={600}
                                height={400}
                                className="object-contain w-auto h-auto"
                            />
                        </div>

                        <div className="relative z-10 text-left max-w-sm">
                            <h1 className="text-xl font-semibold text-white mb-2">
                                Le réseau social pour lecteurs
                            </h1>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Où ta pile à lire va enfin pouvoir se rétrécir !
                            </p>
                            <span className="block mt-4 text-xs text-gray-500 italic">
                            - Sofia Davis
                        </span>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0  backdrop-blur-lg rounded-lg"/>
                        <div className="absolute inset-0 bg-gradient-to-bl from-pink-500 to-tertiary-black opacity-10"/>

                        <div className="relative w-full max-w-md p-8 z-10">
                            <h1 className="text-2xl font-bold mb-6 text-center">Page d&apos;inscription</h1>

                            <p ref={errRef} className={errMsg ? "text-red-500 mb-4" : "hidden"} aria-live="assertive">
                                {errMsg}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="email" className="block text-gray-300 mb-2">
                                        <User className="inline-block mr-2 mb-1"/>
                                        Email
                                    </label>
                                    <div className="flex items-center w-full relative">
                                        <input
                                            type="email"
                                            id="email"
                                            ref={emailRef}
                                            autoComplete="off"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                            className="flex-1 px-4 py-2 bg-transparent border border-secondary rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-highlight"
                                        />
                                        <span className={validEmail ? "text-green-highlight ml-2" : "hidden"}>
                                          <CircleCheckBig size={20}/>
                                        </span>
                                        <span className={validEmail || !email ? "hidden" : "text-red-500 ml-2"}>
                                          <CircleX size={20}/>
                                        </span>
                                    </div>
                                    <Alert
                                        id="uidnote"
                                        className={
                                            !validEmail && email
                                                ? "text-red-500 text-sm mt-2"
                                                : "hidden"
                                        }
                                        variant="destructive"
                                    >
                                        <AlertDescription>
                                            L&apos;adresse électronique doit être au format : example@domain.com.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <div className="relative">
                                    <label htmlFor="pwd" className="block text-gray-300 mb-2">
                                        <Lock className="inline-block mr-2 mb-1"/>
                                        Mot de passe
                                    </label>
                                    <div className="flex items-center w-full">
                                        <input
                                            type="password"
                                            id="pwd"
                                            onChange={(e) => setPwd(e.target.value)}
                                            required
                                            aria-invalid={validPwd ? "false" : "true"}
                                            aria-describedby="pwdnote"
                                            onFocus={() => setPwdFocus(true)}
                                            onBlur={() => setPwdFocus(false)}
                                            className="flex-1 px-4 py-2 bg-transparent border border-secondary rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-highlight"
                                        />
                                        <span className={validPwd ? "text-green-highlight ml-2" : "hidden"}>
                                          <CircleCheckBig size={20}/>
                                        </span>
                                        <span className={validPwd || !pwd ? "hidden" : "text-red-500 ml-2"}>
                                          <CircleX size={20}/>
                                        </span>
                                    </div>
                                    <Alert
                                        id="pwdnote"
                                        className={
                                            !validPwd && pwd
                                                ? "text-red-500 text-sm mt-2"
                                                : "hidden"
                                        }
                                        variant="destructive"
                                    >
                                        <AlertDescription>
                                            Le mot de passe doit inclure au moins 8 caractères, une majuscule, un
                                            chiffre et
                                            un caractère spécial.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <div className="relative mt-4">
                                    <label htmlFor="matchPwd" className="block text-gray-300 mb-2">
                                        <Lock className="inline-block mr-2 mb-1"/>
                                        Confirmation du mot de passe
                                    </label>
                                    <div className="flex items-center w-full">
                                        <input
                                            type="password"
                                            id="matchPwd"
                                            onChange={(e) => setMatchPwd(e.target.value)}
                                            required
                                            aria-invalid={validMatch ? "false" : "true"}
                                            aria-describedby="matchnote"
                                            onFocus={() => setMatchFocus(true)}
                                            onBlur={() => setMatchFocus(false)}
                                            className="flex-1 px-4 py-2 bg-transparent border border-secondary rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-highlight"
                                        />
                                        <span
                                            className={validMatch && matchPwd ? "text-green-highlight ml-2" : "hidden"}>
                                          <CircleCheckBig size={20}/>
                                        </span>
                                        <span className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-2"}>
                                          <CircleX size={20}/>
                                        </span>
                                    </div>
                                    <Alert
                                        id="matchnote"
                                        className={
                                            !validMatch && matchPwd
                                                ? "text-red-500 text-sm mt-2"
                                                : "hidden"
                                        }
                                        variant="destructive"
                                    >
                                        <AlertDescription>
                                            Les mots de passe ne correspondent pas.
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!validEmail || !validPwd || !validMatch}
                                    className={`w-full py-2 rounded-md font-bold ${
                                        !validEmail || !validPwd || !validMatch
                                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                            : "bg-pink-100 text-primary-black hover:bg-opacity-90 transition-colors"
                                    }`}
                                >
                                    S&apos;inscrire
                                </button>

                                <div className="mt-4 text-1xl text-center">
                                    Déjà inscrit ?&nbsp;
                                    <a href="/login" className="text-pink-100 underline">
                                        Page de connexion
                                    </a>
                                </div>
                            </form>
                            <div className="mt-4 text-sm text-center text-gray-500">
                                En t&apos;inscrivant, tu acceptes nos&nbsp;
                                <a href="#" onClick={handlePrivacyPolicyRedirect} className="text-pink-100 underline">
                                    Conditions de service
                                </a> et notre&nbsp;
                                <a href="#" onClick={handleTermsRedirect} className="text-pink-100 underline">
                                    Politique de Confidentialité
                                </a>.
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
        ;
}