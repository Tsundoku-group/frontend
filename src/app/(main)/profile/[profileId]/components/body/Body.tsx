import React from "react";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Activity, LibraryBig, Users} from "lucide-react";
import Shelves from "@/app/(main)/profile/[profileId]/components/body/shelves/Shelves";
import ItemProfileRelation from "@/app/(main)/profile/[profileId]/relations/components/item/ItemProfileRelation";

interface BodyProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Body = ({activeTab, setActiveTab}: BodyProps) => {
    return (
        <div className="mt-4 px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                        <Users className="w-4 h-4 mr-2"/>
                        Ami(e)s
                    </TabsTrigger>
                    <TabsTrigger
                        value="followers"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <Users className="w-4 h-4 mr-2"/>
                        Followers
                    </TabsTrigger>
                    <TabsTrigger
                        value="followed"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white">
                        <Users className="w-4 h-4 mr-2"/>
                        Suivi(e)s
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="shelves">
                    <div className="mt-4">
                        <Shelves/>
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
                        <ItemProfileRelation relationType="friends"/>
                    </div>
                </TabsContent>

                <TabsContent value="followers">
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-5">Followers</h4>
                        <ItemProfileRelation relationType="followers"/>
                    </div>
                </TabsContent>

                <TabsContent value="followed">
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-5">suivi(e)s</h4>
                        <ItemProfileRelation relationType="followed"/>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Body;