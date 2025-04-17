'use client';

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Eye, EyeOff, User, Lock, OctagonAlert, Command} from "lucide-react";
import {HandleLogin} from "@/server-actions/auth/login/actions";
import {useAuthContext} from "@/context/authContext";
import {useProfileContext} from "@/context/profileContext";

export default function LoginPage() {
    const [email, setEmail] = useState<string>('admin@admin.com');
    const [pwd, setPwd] = useState<string>('testtest');

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const {setUser, setIsAuthenticated} = useAuthContext();
    const {setActiveProfileInStorage} = useProfileContext();

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrMsg(null);
        const response = await HandleLogin(email, pwd);
        if (response.success) {
            setIsAuthenticated(true);
            const {userId, email: userEmail, isVerified, profileData} = response;
            setUser({userId, email: userEmail, isVerified});
            setActiveProfileInStorage({
                id: profileData?.id,
                firstName: profileData?.firstName,
                lastName: profileData?.lastName,
                username: profileData?.username,
                status: profileData?.status,
            });

            setEmail('');
            setPwd('');
            setErrMsg(null);

            router.push('/home');
        } else {
            setErrMsg(response.error || null);
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    const handleForgotPasswordRedirect = () => {
        router.push('/forgot-password');
    };

    const handlePrivacyPolicyRedirect = () => {
        router.push('/policy/privacy-policy');
    };

    const handleTermsRedirect = () => {
        router.push('/policy/terms-of-service');
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-tertiary-black text-text-white">
            <div className="hidden lg:flex items-end justify-start bg-secondary-black relative p-12">
                <div className="absolute top-16 left-8 flex items-center space-x-2 z-20">
                    <Command className="w-6 h-6 text-pink-100"/>
                    <h4 className="text-lg font-bold text-pink-100">Tsundoku</h4>
                </div>
                <div className="absolute inset-0 opacity-30">
                    <img
                        src=""
                        alt=""
                        className="object-cover w-full h-full"
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

                <div className="relative w-full max-w-md  p-8 z-10">
                    <h1 className="text-2xl font-bold mb-6 text-center">Bienvenue</h1>
                    {errMsg && (
                        <div className="flex items-center bg-red-500 text-white p-3 mb-4 rounded-md">
                            <OctagonAlert className="mr-2"/>
                            <span>{errMsg}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">
                                <User className="inline-block mr-2 mb-1"/>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-transparent border border-secondary rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-highlight"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                <Lock className="inline-block mr-2 mb-1"/>
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-transparent border border-secondary rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-highlight"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff/> : <Eye/>}
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-pink-100 text-primary-black font-bold py-2 rounded-md hover:bg-opacity-90 transition-colors"
                        >
                            Se connecter
                        </button>
                    </form>

                    <button
                        onClick={handleRegisterRedirect}
                        className="w-full mt-4 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        S&apos;inscrire
                    </button>

                    <button
                        onClick={handleForgotPasswordRedirect}
                        className="w-full mt-2 text-pink-100 hover:underline"
                    >
                        Mot de passe oublié ?
                    </button>

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
    );
}