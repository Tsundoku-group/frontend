import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function ProfileSettingsPage() {
    return (
        <div className="flex items-start p-4 text-white">
            <div className="max-w-3xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-semibold mb-8">Profil</h1>

                    <div className="space-y-1">
                        <label className="text-sm">Nom</label>
                        <Input placeholder="Dupont" className="text-sm"/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Prénom</label>
                        <Input placeholder="Louis" className="text-sm"/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Pseudo</label>
                        <Input placeholder="louis.la.brocante" className="text-sm"/>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                        <div className="space-y-1">
                            <label className="text-sm">Anniversaire</label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    className="text-sm text-gray-500 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Genre</label>
                            <select
                                className="text-sm text-text-white bg-gray-700 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                            >
                                <option>Masculin</option>
                                <option>Féminin</option>
                                <option>Autre</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Mobile</label>
                        <Input placeholder="06 06 06 06 06" className="text-sm"/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Réseaux sociaux</label>
                        <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                            <Input placeholder="Lien vers ton Facebook" className="pl-10 text-sm"/>
                        </div>

                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                            <Input placeholder="Lien vers ton Instagram" className="pl-10 text-sm"/>
                        </div>

                        <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                            <Input placeholder="Lien vers ton X" className="pl-10 text-sm"/>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Bio</label>
                        <textarea className="w-full text-sm bg-gray-700 rounded-md p-2 text-white resize-none"
                                  placeholder="Je suis une bio, chouette !" rows={3}></textarea>
                    </div>

                    <h3 className="text-lg font-semibold mt-4">Contributions & Activités</h3>
                    <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                            <input type="checkbox" id="privateProfile" className="mt-1"/>
                            <label htmlFor="privateProfile" className="text-sm">
                                Rendre le profil privé et masquer l'activité
                            </label>
                        </div>
                        <div className="flex items-start space-x-2">
                            <input type="checkbox" id="includePrivateContributions" className="mt-1"/>
                            <label htmlFor="includePrivateContributions" className="text-sm">
                                Inclure les contributions privées dans mon profil
                            </label>
                        </div>
                    </div>

                    <Button
                        className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-sm font-semibold py-2 rounded-md">
                        Modifier le profil
                    </Button>
                </div>

                <div className="w-1/4 flex flex-col items-center space-y-3">
                    <h3 className="text-base font-semibold mb-2">Photo de profil</h3>
                    <div className="w-40 h-auto rounded-full overflow-hidden mb-2">
                        <img
                            src="https://ui-avatars.com/api/?name=Louis+Dupont&background=4F46E5&color=fff"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center">
                        <span>Modifier</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}