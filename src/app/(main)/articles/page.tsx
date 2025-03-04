'use client';

import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import CustomSelect from "./components/CustomSelect";
import "./styles/styles.css";
import ArticleForm from "./components/ArticleForm";
import { fetchProfileArticles, deleteArticle } from "./actions";
import { useProfileContext } from "@/context/profileContext";
import { formatDate } from "@/utils/dateUtils";
import { Article } from "@/models/Article";

export default function ArticlesPage() {
    const [showForm, setShowForm] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    useEffect(() => {
        async function loadArticles() {
            try {
                const data = await fetchProfileArticles(profileId);
                setArticles(data);
            } catch (error) {
                throw new Error("Failed to fetch articles : " + error);
            }
        }

        loadArticles();
    }, [profileId]);

    const handleNewArticleButton = () => {
        setSelectedArticle(null);
        setShowForm(true);
    };

    const handleEditArticle = (article: Article) => {
        setSelectedArticle(article);
        setShowForm(true);
    };

    const handleDeleteArticle = async (articleId: string) => {
        try {
            if (!profileId) throw new Error("Profile id is missing");
            await deleteArticle(articleId, profileId);
            setArticles(articles.filter(article => article.id !== articleId));
        } catch (error) {
            throw new Error("Failed to delete article : " + error);
        }
    };

    return (
        <>
            {showForm ? (
                <ArticleForm article={selectedArticle} />
            ) : (
                <>
                    <div className="flex justify-between my-5">
                        <h2>Articles</h2>
                        <button onClick={handleNewArticleButton} className="primary-btn flex items-center gap-3 py-3 px-5 rounded-full">
                            <Plus width={20} height={20} />
                            <span>Écrire un article</span>
                        </button>
                    </div>

                    <table className="p-5 w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Titre</th>
                                <th>Date de création</th>
                                <th>Dernière édition</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <tr key={article.id} className="border-y-4 border-red-500">
                                        <td>
                                            <CustomSelect />
                                        </td>
                                        <td>{article.title}</td>
                                        <td>{formatDate(article.createdAt)}</td>
                                        <td>{formatDate(article.updatedAt)}</td>
                                        <td className="flex gap-4">
                                            <button className="flex gap-2 items-center" onClick={() => handleEditArticle(article)}>
                                                <Pencil width={15} height={15} />
                                                <span>Éditer</span>
                                            </button>
                                            <button onClick={() => handleDeleteArticle(article.id)}>
                                                <Trash2 width={15} height={15} className="text-red-highlight" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        Aucun article trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
}