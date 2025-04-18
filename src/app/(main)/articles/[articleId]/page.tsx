'use client';

import { formatDate } from '@/utils/dateUtils';
import { fetchArticle } from '@/server-actions/main/articles/actions';
import { useEffect, useState } from 'react';
import { Article } from '@/models/Article';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage({ params }: { params: { articleId: number } }) {
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        async function loadArticle() {
            try {
                const data = await fetchArticle(params.articleId);
                console.log(data);
                if (data !== undefined && data !== null) {
                    setArticle(data);
                }
            } catch (error) {
                console.error("Failed to fetch article: ", error);
            }
        }
        void loadArticle();
    }, [params.articleId]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            {article ? (
                <div className="mt-10">
                    <Link
                        href="/articles"
                        className="primary-btn flex items-center gap-3 mb-5 py-3 px-5 rounded-full w-fit"
                    >
                        <ArrowLeft size={16} />
                        <span>Retour aux articles</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                    <p className="text-sm text-gray-600">
                        Créé le : {formatDate(article.createdAt)} – Dernière modification : {formatDate(article.updatedAt)}
                    </p>
                    <hr className="my-4" />
                    <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
}