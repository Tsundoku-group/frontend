import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";

export default function AccountSettingsPage() {
    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-semibold mb-8 text-white">Comptes</h1>
                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Information du compte</h2>
                        <div className="border border-dashed border-purple-600 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-400">
                                Vous n’avez pas vérifié votre adresse électronique ! Pour publier un post et effectuer
                                d’autres actions, veuillez vérifier votre adresse électronique.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-white">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue="anne.honyme@gmail.com"
                                    className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    style={{width: "300px"}}
                                />
                        </div>
                    </Card>

                    <Card className="p-6 mb-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Modifier le mot de passe</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="current-password" className="text-sm text-white">Mot de passe actuel</label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        placeholder="mdp123!"
                                        className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        style={{width: "300px"}}
                                    />
                            </div>
                            <div>
                                <label htmlFor="new-password" className="text-sm text-white">Nouveau mot de
                                    passe</label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="mdp123!"
                                    className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    style={{width: "300px"}}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="text-sm text-white">Confirmer le nouveau
                                    mot de passe</label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="mdp123!"
                                    className="bg-gray-900 text-gray-300 border border-gray-700 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    style={{width: "300px"}}
                                />
                            </div>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white mt-4">Modifier</Button>
                    </Card>

                    <Card className="p-6 rounded-lg bg-secondary-black border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Suppression du compte</h2>
                        <div className="border border-dashed border-red-500 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-400">
                                Attention : Cette action est irréversible. La suppression de votre compte entraînera
                                la
                                perte
                                de toutes vos données.
                            </p>
                        </div>
                        <Button className="bg-red-500 hover:bg-red-600 text-white">Supprimer</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};