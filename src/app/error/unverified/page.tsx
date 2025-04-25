'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/context/authContext';
import { handleResendVerification } from '@/server-actions/error/unverified/actions';
import { deleteSession } from '@/services/auth/session';

export default function UnverifiedPage() {
    const { user } = useAuthContext();

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const router = useRouter();

    const resendVerification = async () => {
        if (!user?.email) return;

        const result = await handleResendVerification(user.email);

        if (result.success) {
            setMessage('Email de vérification renvoyé avec succès.');
            setMessageType('success');
        } else {
            setMessage("Échec de l'envoi de l'email de vérification.");
            setMessageType('error');
        }
    };

    const logout = async () => {
        await deleteSession();
        router.push('/login');
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-tertiary-black border border-gray-700 rounded-xl shadow-lg max-w-md w-full p-8 text-center">
                <div className="flex flex-col items-center mb-6">
                    <AlertCircle className="text-red-500 w-14 h-14 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Compte non vérifié</h1>
                    <p className="text-sm text-gray-400">
                        Nous vous avons envoyé un lien de vérification par e-mail. Veuillez cliquer dessus pour activer votre compte.
                    </p>
                </div>

                <div className="space-y-4 mt-6">
                    <button
                        onClick={resendVerification}
                        className="w-full px-4 py-2 bg-purple-highlight text-white font-medium rounded-lg hover:bg-purple-600 transition"
                    >
                        Renvoyer l’email de vérification
                    </button>
                    <button
                        onClick={logout}
                        className="w-full px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition"
                    >
                        Retour à la page de connexion
                    </button>
                </div>

                {message && (
                    <div
                        className={`mt-6 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                            messageType === 'success'
                                ? 'bg-green-100 text-green-800 border-green-500'
                                : 'bg-red-100 text-red-800 border-red-500'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </section>
    );
}