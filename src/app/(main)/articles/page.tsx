'use client';

import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import CustomSelect from "./components/CustomSelect";
import "./styles/styles.css";
import ArticleForm from "./components/ArticleForm";
import { fetchProfileArticles, deleteArticle, updateArticleStatus } from "./actions";
import { useProfileContext } from "@/context/profileContext";
import { formatDate } from "@/utils/dateUtils";
import { Article } from "@/models/Article";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ArticlesPage() {
    const [showForm, setShowForm] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const loadArticles = useCallback(async () => {
        try {
            const data = await fetchProfileArticles(profileId);
            console.log(data);
            setArticles(data);
        } catch (error) {
            console.error("Failed to fetch articles: ", error);
        }
    }, [profileId]);

    useEffect(() => {
        if (profileId) {
            loadArticles();
        }
    }, [profileId, loadArticles]);

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
            await loadArticles();
        } catch (error) {
            console.error("Failed to delete article: ", error);
        }
    };

    const handleStatusChange = async (articleId: string, newStatus: string) => {
        try {
            if (!profileId) throw new Error("Profile id is missing");
            await updateArticleStatus(articleId, newStatus, profileId);
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId ? { ...article, status: newStatus } : article
                )
            );
        } catch (error) {
            console.error("Failed to update article status: ", error);
        }
    };

    const handleFormClose = async () => {
        setShowForm(false);
        await loadArticles();
    };

    const confirmDelete = async () => {
        if (articleToDelete) {
            await handleDeleteArticle(articleToDelete.id);
            setShowConfirmDelete(false);
            setArticleToDelete(null);
        }
    };

    return (
        <>
            {showForm ? (
                <ArticleForm
                    article={selectedArticle}
                    onClose={handleFormClose}
                    onDelete={handleDeleteArticle}
                />
            ) : (
                <>
                    <div className="flex justify-between my-5">
                        <h2>Articles</h2>
                        <button
                            onClick={handleNewArticleButton}
                            className="primary-btn flex items-center gap-5 py-5 px-5 rounded-full"
                        >
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
                                            <CustomSelect
                                                selectedStatus={article.status}
                                                onChange={(newStatus) => handleStatusChange(article.id, newStatus)}
                                            />
                                        </td>
                                        <td>{article.title}</td>
                                        <td>{formatDate(article.createdAt.date)}</td>
                                        <td>{formatDate(article.updatedAt.date)}</td>
                                        <td className="flex gap-4">
                                            <button onClick={() => handleEditArticle(article)}>
                                                <Pencil width={15} height={15} />
                                            </button>
                                            <button>
                                                <a href={`/articles/${article.id}`} target="_blank" rel="noopener noreferrer">
                                                    <Eye width={15} height={15} />
                                                </a>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setArticleToDelete(article);
                                                    setShowConfirmDelete(true);
                                                }}
                                            >
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
                    {showConfirmDelete && (
                        <ConfirmDialog
                            onCancel={() => {
                                setShowConfirmDelete(false);
                                setArticleToDelete(null);
                            }}
                            onConfirm={confirmDelete}
                            message="Supprimer cet article ? Cette action est irréversible."
                        />
                    )}
                </>
            )}
        </>
    );
}