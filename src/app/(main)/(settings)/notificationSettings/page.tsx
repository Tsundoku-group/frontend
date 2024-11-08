import {Card} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";

export default function NotificationSettingsPage() {
    return (
        <div className="flex items-start p-4">
            <div className="max-w-2xl w-full p-1 flex space-x-6">
                <div className="flex-1 space-y-4">
                    <h1 className="text-2xl font-bold text-white">Paramètres des notifications</h1>

                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-white">Notifications générales</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Activer toutes les notifications</span>
                                <Switch/>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-text-white">Notifications sociales</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Likes sur mes posts</span>
                                <Switch/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Nouveaux commentaires</span>
                                <Switch/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Nouveaux abonnés</span>
                                <Switch/>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-secondary-black rounded-lg border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-text-white">Fréquence des notifications</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Notifications instantanées</span>
                                <Switch/>
                            </div>
                        </div>
                    </Card>

                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Enregistrer les préférences
                    </Button>
                </div>
            </div>
        </div>
    );
};