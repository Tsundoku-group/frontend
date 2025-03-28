import React, { useState, useEffect } from 'react';
import SlateEditor from './SlateEditor';
import '../styles/styles.css';
import DragAndDropImage from './DragAndDropImage';
import { Article } from '@/models/Article';
import { formatDate } from '@/utils/dateUtils';
import { ArrowLeft } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/ConfirmDialog';
import { useProfileContext } from '@/context/profileContext';
import { submitArticle } from '../actions';

interface ArticleFormProps {
    article?: Article | null;
    onClose: () => void;
    onDelete: (articleId: string) => Promise<void>;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onClose, onDelete }) => {
    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");
    const [status, setStatus] = useState(article?.status || "brouillon");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id ? parseInt(activeProfileInStorage?.id) : undefined;

    const statusLabels: { [key: string]: string } = {
        brouillon: "Brouillon",
        "en-cours": "En cours",
        publie: "Publié",
    };

    const statusColor = status === "brouillon"
        ? "var(--highlight-red)"
        : status === "en-cours"
            ? "var(--highlight-yellow)"
            : status === "publie"
                ? "var(--highlight-green)"
                : "inherit";

    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setContent(article.content);
            setStatus(article.status);
        }
    }, [article]);

    const confirmDelete = async () => {
        if (!article) return;
        try {
            await onDelete(article.id);
            setShowConfirmDelete(false);
            onClose();
        } catch (error) {
            throw new Error("Failed to delete article : " + error);
        }
    };

    const handleSubmit = async (newStatus: string) => {
        if (!profileId) {
            console.error("Profile id is missing");
            return;
        }
        setStatus(newStatus);
        const payload = {
            title,
            content,
            status: newStatus,
            authorId: profileId
        };

        console.log("Payload envoyé :", payload);

        try {
            await submitArticle(article ? article.id : null, payload, profileId);
            onClose();
        } catch (error) {
            console.error("Error submitting article:", error);
        }
    };

    return (
        <div className="mt-10 relative">
            <button onClick={onClose} className="primary-btn flex items-center gap-3 mb-5 py-3 px-5 rounded-full">
                <ArrowLeft size={16} />
                <span>Retour aux articles</span>
            </button>
            <div className="grid grid-cols-2 gap-10 mb-10">
                <div>
                    <label htmlFor="title">Titre article</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Titre de ton article"
                        className="w-full px-4 py-2 bg-secondary-black border border-tertiary-black rounded-3xl mb-4"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <DragAndDropImage />
                </div>
                <div className="block">
                    <button
                        className="w-full p-2 bg-tertiary-black rounded mb-4 hover:bg-primary-black transition-colors duration-[400ms] ease"
                        onClick={() => handleSubmit("brouillon")}
                    >
                        Sauvegarder en brouillon
                    </button>
                    <div className="flex justify-between mb-4">
                        <button
                            onClick={() => setShowConfirmDelete(true)}
                            className="w-1/2 p-2 bg-tertiary-black text-red-highlight rounded mr-2 hover:bg-primary-black transition-colors duration-[400ms] ease"
                        >
                            Supprimer
                        </button>
                        <button
                            className="w-1/2 secondary-btn ml-2"
                            onClick={() => handleSubmit("publie")}
                        >
                            Publier
                        </button>
                    </div>
                    <div className="text-gray-500">
                        {article &&
                            formatDate(article.updatedAt.date) !== formatDate(article.createdAt.date) && (
                                <p>
                                Dernière modification : <span id="last-modified">{article ? formatDate(article.updatedAt.date) : "N/A"}</span>
                                </p>
                            )
                        }
                        <p>
                            Date de publication : <span id="publish-date">{article ? formatDate(article.createdAt.date) : "N/A"}</span>
                        </p>
                        <p>
                            Statut : <span style={{ color: statusColor }}>{statusLabels[status] || status}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="block">
                <SlateEditor content={content} onChange={setContent} />
            </div>

            {showConfirmDelete && (
                <ConfirmDeleteDialog
                    onCancel={() => setShowConfirmDelete(false)}
                    onConfirm={confirmDelete}
                    message="Supprimer l'article ? Cette action est irréversible."
                />
            )}
        </div>
    );
};

export default ArticleForm;