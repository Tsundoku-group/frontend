import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface ConfirmDialogProps {
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onCancel, onConfirm }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-black bg-opacity-50">
            <div className="bg-secondary-black p-5 rounded-lg">
                <TriangleAlert className="mx-auto w-16 h-16" />
                <p className="text-center mt-4">
                    {message}
                </p>
                <div className="flex justify-end gap-4 mt-5">
                    <button onClick={onCancel} className="secondary-btn">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="primary-btn rounded-full">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;