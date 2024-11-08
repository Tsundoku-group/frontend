import React from "react";
import {Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";

export default function AccessibilitySettingsPage() {
    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold text-white">Accessibilités</h1>
                    <p className="text-sm text-gray-400">
                        Personnalisez les paramètres pour améliorer l'accessibilité et l'expérience utilisateur dans
                        l'application.
                    </p>

                    <Card className="bg-secondary-black rounded-lg border border-gray-700">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-white">Contraste élevé</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 mb-4">
                                Activez le mode contraste élevé pour une meilleure lisibilité.
                            </p>
                            <Switch />
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary-black rounded-lg border border-gray-700">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-white">Taille du texte</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 mb-4">
                                Ajustez la taille du texte dans l'application.
                            </p>
                            <Slider defaultValue={[16]} max={32} min={12} step={1}/>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary-black rounded-lg border border-gray-700">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-white">Navigation</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 mb-4">
                                Activez les fonctionnalités de navigation spécifiques pour une meilleure expérience.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Navigation au clavier</span>
                                    <Switch/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Mode focus</span>
                                    <Switch/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Désactiver les animations</span>
                                    <Switch/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Sauvegarder les paramètres
                    </Button>
                </div>
            </div>
        </div>
    );
};