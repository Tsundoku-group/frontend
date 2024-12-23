import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebaseConfig';
import {listAll} from "@firebase/storage";

const MAX_IMAGES_PER_USER = 50;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get('file') as Blob | null;
        const filename = formData.get('filename') as string;
        const profileId = formData.get('profileId') as string;
        const type = formData.get('type') as string;

        if (!file || !filename || !profileId || !type) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        if (!['profile', 'cover'].includes(type)) {
            return NextResponse.json({ error: 'Type non valide' }, { status: 400 });
        }

        const folderRef = ref(storage, `profilePictures/${profileId}`);
        const result = await listAll(folderRef);

        if (result.items.length >= MAX_IMAGES_PER_USER) {
            return NextResponse.json(
                { error: `Limite atteinte. Maximum ${MAX_IMAGES_PER_USER} images autorisées.` },
                { status: 403 }
            );
        }

        const filePath = `profilePictures/${profileId}/${filename}.jpg`;
        const fileRef = ref(storage, filePath);

        try {
            return NextResponse.json(
                { error: 'L\'image existe déjà.', url: await getDownloadURL(fileRef) },
                { status: 409 }
            );
        } catch (error: any) {
            if (error.code === 'storage/object-not-found') {

                const buffer = Buffer.from(await file.arrayBuffer());
                await uploadBytes(fileRef, buffer);

                const downloadURL = await getDownloadURL(fileRef);

                return NextResponse.json({ url: downloadURL, message: 'Fichier téléversé.' }, { status: 201 });
            } else {
                return NextResponse.json({ error: 'Erreur lors de la vérification du fichier.' }, { status: 500 });
            }
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    }
}