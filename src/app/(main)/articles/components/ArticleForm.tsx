import React, { useState, useEffect } from 'react';
import SlateEditor from './SlateEditor';
import '../styles/styles.css';
import DragAndDropImage from './DragAndDropImage';
import { Article } from '@/models/Article';

interface ArticleFormProps {
    article?: Article | null;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article }) => {
    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");

    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setContent(article.content);
        }
    }, [article]);

    return (
        <div className="mt-10">
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
                        <button className="w-1/2 p-2 bg-tertiary-black text-red-highlight rounded mr-2">Supprimer</button>
                        <button className="w-1/2 p-2 bg-green-highlight rounded ml-2">Publier</button>
                    </div>
                    <div className="text-gray-500">
                        <p>Dernière modification : <span id="last-modified">{article?.updatedAt || "N/A"}</span></p>
                        <p>Date de publication : <span id="publish-date">{article?.createdAt || "N/A"}</span></p>
                    </div>
                </div>
            </div>
            <div className='block'>
                <SlateEditor content={content} onChange={setContent} />
            </div>
        </div>
    );
};

export default ArticleForm;