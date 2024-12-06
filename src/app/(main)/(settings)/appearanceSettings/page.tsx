"use client";

import React, {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export default function AppearanceSettingsPage() {
    const [selectedTheme, setSelectedTheme] = useState("light");
    const [selectedFont, setSelectedFont] = useState("Inter");

    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-semibold mb-8 text-white">Apparence</h1>
                        <p className="text-sm text-gray-400">
                            Personnaliser l&apos;apparence de l&apos;application. Basculer automatiquement entre les thèmes du
                            jour et de la nuit.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-medium text-text-white">Police</h2>
                            <p className="text-sm text-gray-400">Définissez la police que vous souhaitez utiliser dans
                                le tableau de bord.</p>
                        </div>
                        <Select
                            value={selectedFont}
                            onValueChange={(value) => setSelectedFont(value)}
                        >
                            <SelectTrigger className="w-60 text-gray-500 bg-gray-900 rounded-lg border border-gray-700">
                                <SelectValue placeholder="Select a font"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Poppins">Poppins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-medium text-text-white">Thème</h2>
                            <p className="text-sm text-gray-400">Sélectionnez le thème du tableau de bord.</p>
                        </div>
                        <div className="flex space-x-4">
                            <Card
                                onClick={() => setSelectedTheme("light")}
                                className={`cursor-pointer ${selectedTheme === "light" ? "ring-2 ring-purple-600" : ""}`}
                            >
                                <CardContent className="p-4">
                                    <div className="w-40 h-20 bg-gray-100 rounded-lg"></div>
                                    <p className="text-center text-sm mt-2 text-gray-700">Light</p>
                                </CardContent>
                            </Card>
                            <Card
                                onClick={() => setSelectedTheme("dark")}
                                className={`cursor-pointer ${selectedTheme === "dark" ? "ring-2 ring-purple-600" : ""}`}
                            >
                                <CardContent className="p-4">
                                    <div className="w-40 h-20 bg-gray-800 rounded-lg"></div>
                                    <p className="text-center text-sm mt-2 text-gray-300">Dark</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Mise à jour des préférences
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};