'use client';

import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import CustomSelect from "./components/CustomSelect";
import "./styles/styles.css";
import ArticleForm from "./components/ArticleForm";

export default function ArticlesPage() {
    const [showForm, setShowForm] = useState(false);

    const handleNewArticleButton = () => {
        setShowForm(true);
    };

    return (
        <>
            {showForm ? (
                <ArticleForm />
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
                            <tr className="border-y-4 border-red-500">
                                <td>
                                    <CustomSelect />
                                </td>
                                <td>Je suis un titre claqué au sol</td>
                                <td>11 décembre 2024</td>
                                <td>à l'instant</td>
                                <td className="flex gap-4">
                                    <button className="flex gap-2 items-center">
                                        <Pencil width={15} height={15} />
                                        <span>Éditer</span>
                                    </button>
                                    <button>
                                        <Trash2 width={15} height={15} className="text-red-highlight" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}