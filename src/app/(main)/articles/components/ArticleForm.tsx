import React, { useState, useEffect } from 'react';
import SlateEditor from './SlateEditor';
import '../styles/styles.css';
import DragAndDropImage from './DragAndDropImage';
import { Article } from '@/models/Article';
import { formatDate } from '@/utils/dateUtils';
import { ArrowLeft, TriangleAlert } from 'lucide-react';

interface ArticleFormProps {
    article?: Article | null;
    onClose: () => void;
    onDelete: (articleId: string) => Promise<void>;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onClose, onDelete }) => {
    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setContent(article.content);
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
                    <button className="w-full p-2 bg-tertiary-black rounded mb-4">Sauvegarder en brouillon</button>
                    <div className="flex justify-between mb-4">
                        <button
                            onClick={() => setShowConfirmDelete(true)}
                            className="w-1/2 p-2 bg-tertiary-black text-red-highlight rounded mr-2"
                        >
                            Supprimer
                        </button>
                        <button className="w-1/2 p-2 bg-green-highlight rounded ml-2">Publier</button>
                    </div>
                    <div className="text-gray-500">
                        <p>Dernière modification : <span id="last-modified">{article ? formatDate(article.updatedAt) : "N/A"}</span></p>
                        <p>Date de publication : <span id="publish-date">{article ? formatDate(article.createdAt) : "N/A"}</span></p>
                    </div>
                </div>
            </div>
            <div className='block'>
                <SlateEditor content={content} onChange={setContent} />
            </div>

            {showConfirmDelete && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary-black bg-opacity-50">
                    <div className="bg-secondary-black p-5 rounded-lg">
                        <TriangleAlert className="mx-auto w-16 h-16" />
                        <p className="text-center mt-4">
                            Supprimer l&apos;article ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end gap-4 mt-5">
                            <button onClick={() => setShowConfirmDelete(false)} className="secondary-btn">
                                Annuler
                            </button>
                            <button onClick={confirmDelete} className="primary-btn rounded-full">
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleForm;