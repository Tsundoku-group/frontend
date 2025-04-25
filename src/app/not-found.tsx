'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <AlertTriangle className="text-yellow-400 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Page introuvable</h1>
            <p className="text-gray-400 mb-6">La page que vous recherchez n’existe pas.</p>
            <Button
                className="bg-purple-highlight text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={() => router.push('/')}
            >
                Retour à l’accueil
            </Button>
        </div>
    );
}