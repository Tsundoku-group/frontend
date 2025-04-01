'use client';

import { formatDate } from '@/utils/dateUtils';
import { fetchArticle } from './actions';
import { useEffect, useState } from 'react';
import { Article } from '@/models/Article';

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
        loadArticle();
    }, [params.articleId]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            {article ? (
                <>
                    <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                    <p className="text-sm text-gray-600">
                        Créé le : {formatDate(article.createdAt.date)} – Dernière modification : {formatDate(article.updatedAt.date)}
                    </p>
                    <hr className="my-4" />
                    <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />
                </>
            ) : (
                <p>Loading article...</p>
            )}
        </div>
    );
}