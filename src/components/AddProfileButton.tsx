'use client';

import React, {useState} from 'react';
import {Dialog, DialogTrigger} from '@/components/ui/dialog';
import {UserPlus} from 'lucide-react';
import StepperForm from "@/components/stepperForm/StepperForm";
import {ShowToast} from "@/components/ShowToast";

type AddProfileButtonProps = {
    onProfileAdded: () => void;
    onClose: () => void;
};

const AddProfileButton = ({onProfileAdded, onClose}: AddProfileButtonProps) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleFormSuccess = () => {
        ShowToast("default", "Profil créé avec succès !");
        setDialogOpen(false);
        onProfileAdded();
        onClose();
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center text-white w-full hover:bg-gray-700 p-2 rounded-lg transition ease-in delay-100 mt-4">
                    <UserPlus className="w-6 h-6 text-white ml-6"/>
                    <span className="text-sm ml-5">Ajouter un profil</span>
                </button>
            </DialogTrigger>
            <StepperForm onSuccess={handleFormSuccess}/>
        </Dialog>
    );
};

export default AddProfileButton;