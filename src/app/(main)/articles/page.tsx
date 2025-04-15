'use client';

import { ArrowDownUp, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import CustomSelect from "./components/CustomSelect";
import "./styles/styles.css";
import ArticleForm from "./components/ArticleForm";
import { fetchProfileArticles, deleteArticle, updateArticleStatus } from "./actions";
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
