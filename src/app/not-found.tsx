'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1B1E2E] to-[#0F111A] text-white px-6 text-center">
            <div className="bg-[#1C1F2B] border border-[#2B2F40] shadow-lg rounded-2xl p-10 max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                    <AlertTriangle className="text-red-highlight w-14 h-14 mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Page introuvable</h1>
                    <p className="text-gray-400 text-sm">
                        La page que vous cherchez n’existe pas ou a été déplacée.
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="w-full px-4 py-2 mt-4 bg-purple-highlight text-white font-medium rounded-lg hover:bg-purple-600 transition duration-200"
                >
                    Retour à l’accueil
                </button>
            </div>
        </section>
    );
}