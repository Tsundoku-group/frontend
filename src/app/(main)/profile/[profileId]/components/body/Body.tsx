import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Activity, LibraryBig, Users} from "lucide-react";
import Shelves from "@/app/(main)/profile/[profileId]/components/body/shelves/Shelves";
import ItemProfileRelation from "@/app/(main)/profile/[profileId]/relations/components/item/ItemProfileRelation";

const Body = () => {
    return (
        <div className="mt-4 px-4">
            <Tabs defaultValue="shelves">
                <TabsList className="flex justify-start space-x-4 bg-primary-black pb-2">
                    <TabsTrigger
                        value="shelves"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <LibraryBig className="w-4 h-4 mr-2"/>
                        Étagères
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <Activity className="w-4 h-4 mr-2"/>
                        Activité
                    </TabsTrigger>
                    <TabsTrigger
                        value="friends"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Amis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="shelves">
                    <div className="mt-4">
                        <Shelves />
                    </div>
                </TabsContent>

                <TabsContent value="activity">
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Activité</h2>
                        <p>Affiche ici les activités récentes...</p>
                    </div>
                </TabsContent>

                <TabsContent value="friends">
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-5">Ami(e)s</h4>
                        <ItemProfileRelation />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Body;