import { useState, useRef } from "react";
import { IoCloudUpload } from "react-icons/io5";

const DragAndDropImage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);

    const validExtensions = ["png", "jpg", "jpeg", "svg"];
    const maxFileSize = 1000000;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        if (validExtensions.includes(fileExtension)) {
            if (file.size > maxFileSize) {
                setErrorMessage("Fichier trop volumineux. Taille maximale : 1Mo");
                setSuccessMessage("");
                return;
            }
            setSuccessMessage("Fichier valide");
            setErrorMessage("");

            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                (fileInputRef.current as HTMLInputElement).files = dataTransfer.files;
            }
        } else {
            setErrorMessage("Extension invalide. Formats acceptés : PNG, JPG, JPEG, SVG");
            setSuccessMessage("");

            if (fileInputRef.current) {
                (fileInputRef.current as HTMLInputElement).value = "";
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        if (validExtensions.includes(fileExtension)) {
            if (file.size > maxFileSize) {
                setErrorMessage("Fichier trop volumineux. Taille maximale : 1Mo");
                setSuccessMessage("");
                e.target.value = "";
                return;
            }
            setSuccessMessage("Fichier valide");
            setErrorMessage("");
        } else {
            setErrorMessage("Extension invalide. Formats acceptés : PNG, JPG, JPEG, SVG");
            setSuccessMessage("");
            e.target.value = "";
        }
    };

    return (
        <>
            <label htmlFor="image">Image de l&apos;article</label>
            <input
                type="file"
                id="image"
                name="image"
                className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div
                className="flex flex-col items-center cursor-pointer border-dashed border-2 rounded-3xl border-text-white p-8 text-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <IoCloudUpload className="mb-2 text-4xl" />
                <p>{isDragging ? "Relâche pour déposer" : "Glisse et dépose une image ici"}</p>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </div>
        </>
    );
};

export default DragAndDropImage;