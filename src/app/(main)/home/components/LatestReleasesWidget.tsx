import React, { useEffect, useState, useCallback } from 'react';
import { fetchLatestReleases } from '../actions';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { truncateString } from '@/utils/string-utils';
import '../styles/styles.css';

interface Book {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    thumbnail: string;
    link: string;
}

const LatestReleasesWidget: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchLatestReleasesData = useCallback(async () => {
        try {
            const data = await fetchLatestReleases(3);
            setBooks(data);
        } catch (error: any) {
            console.error("Error when fetching latest releases data : ", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLatestReleasesData();
    }, [fetchLatestReleasesData]);

    return (
        <div className="bg-secondary-black border-tertiary-black border text-text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6" />
                    <h2 className="text-xl font-bold">Dernières sorties</h2>
                </div>
                <ArrowRight className="h-6 w-6" />
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500">Erreur: {error.message}</div>
            ) : (
                <div className="grid gap-5">
                    {books.map((book, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                                <img src={book.thumbnail} alt={book.title} className="cover-latest-releases-img rounded-xl" />
                            </div>
                            <div className="col-span-2">
                                <h3 className="text-lg italic font-semibold truncate whitespace-nowrap overflow-hidden">{book.title}</h3>
                                <div className="text-sm">
                                    <p className="font-semibold my-2">{book.authors.join(', ')}</p>
                                    <p>{book.publishedDate}</p>
                                    <p className="text-justify my-2">{truncateString(book.description)}</p>
                                    <a href={book.link} className="text-green-highlight font-semibold">En savoir plus</a>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr className="border border-tertiary-black" />
                    <button className="text-green-highlight font-semibold">Voir plus</button>
                </div>
            )}
        </div>
    );
};

export default LatestReleasesWidget;