import React, {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BookOpen, LibraryBig, User, Users} from "lucide-react";
import {fetchGroups, fetchProfiles} from "@/server-actions/main/search/action";

type Props = {
    search: string,
}

const SearchBar = ({search}: Props) => {
    const [activeTab, setActiveTab] = useState<string>('shelves');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseProfile = await fetchProfiles(search);
                const responseGroup = await fetchGroups(search)
            } catch (error) {
                console.error(error);
            }
        }

        void fetchData();
    }, [search]);

    return (
        <>
            <p>{search}</p>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex justify-start space-x-4 bg-primary-black pb-2">
                    <TabsTrigger
                        value="books"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <BookOpen className="w-4 h-4 mr-2"/>
                        Livres
                    </TabsTrigger>

                    <TabsTrigger
                        value="shelves"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <LibraryBig className="w-4 h-4 mr-2"/>
                        Étagères
                    </TabsTrigger>

                    <TabsTrigger
                        value="profiles"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <User className="w-4 h-4 mr-2"/>
                        Profiles
                    </TabsTrigger>


                    <TabsTrigger
                        value="clubs"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <Users className="w-4 h-4 mr-2"/>
                        Clubs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="books">
                    <div className="mt-4">
                        <p>Livres</p>
                    </div>
                </TabsContent>

                <TabsContent value="shelves">
                    <div className="mt-4">
                        <p>Shelves</p>
                    </div>
                </TabsContent>

                <TabsContent value="profiles">
                    <div className="mt-4">
                        <p>Profiles</p>
                    </div>
                </TabsContent>

                <TabsContent value="clubs">
                    <div className="mt-4">
                        <p>Clubs</p>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default SearchBar;
