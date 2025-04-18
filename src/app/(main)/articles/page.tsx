'use client';

import { ArrowDownUp, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import CustomSelect from "@/app/(main)/articles/_components/CustomSelect";
import "@/app/(main)/articles/_styles/styles.css";
import ArticleForm from "@/app/(main)/articles/_components/ArticleForm";
import { fetchProfileArticles, deleteArticle, updateArticleStatus } from "@/server-actions/main/articles/actions";
import { useProfileContext } from "@/context/profileContext";
import { formatDate } from "@/utils/dateUtils";
import { Article } from "@/models/Article";
import ConfirmDialog from "@/components/ConfirmDialog";
import Pagination from "@/components/Pagination";

export default function ArticlesPage() {
    const [showForm, setShowForm] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [totalPages, setTotalPages] = useState(1);

    const { activeProfileInStorage } = useProfileContext();
    const profileId = activeProfileInStorage?.id;

    const loadArticles = useCallback(async () => {
        try {
            const data = await fetchProfileArticles(profileId, currentPage, sortField, sortOrder);
            console.log(data);
            setArticles(data.articles || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch articles: ", error);
            setArticles([]);
            setTotalPages(1);
        }
    }, [profileId, currentPage, sortField, sortOrder]);

    useEffect(() => {
        if (profileId) {
            loadArticles().catch((error) => {
                console.error("Erreur lors du chargement des articles :", error);
            });
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
        if (!profileId) {
            console.error("L'identifiant du profil est manquant.");
            return;
        }

        const result = await deleteArticle(articleId, profileId);

        if (result?.success) {
            await loadArticles();
        } else {
            console.error("Échec de la suppression de l'article :", result?.message || "Erreur inconnue");
        }
    };

    const handleStatusChange = async (articleId: string, newStatus: string) => {
        if (!profileId) {
            console.error("L'identifiant du profil est manquant.");
            return;
        }

        const result = await updateArticleStatus(articleId, newStatus, profileId);

        if (result?.success) {
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId ? { ...article, status: newStatus } : article
                )
            );
        } else {
            console.error("Échec de la mise à jour du statut :", result?.message || "Erreur inconnue");
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

    const handleSortToggle = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
        setCurrentPage(1);
    };

    const headers = [
        { label: "Statut", field: "status" },
        { label: "Titre", field: "title" },
        { label: "Date de création", field: "createdAt" },
        { label: "Dernière édition", field: "updatedAt" },
    ];

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
                                {headers.map((header, index) => (
                                    <th key={index}>
                                        <span
                                            onClick={() => handleSortToggle(header.field)}
                                            className="cursor-pointer inline-flex items-center whitespace-nowrap ml-2"
                                        >
                                            {header.label}
                                            <ArrowDownUp width={20} height={20} className="ml-2" />
                                        </span>
                                    </th>
                                ))}
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
                                        <td>{formatDate(article.createdAt)}</td>
                                        <td>{formatDate(article.updatedAt)}</td>
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

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />

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
