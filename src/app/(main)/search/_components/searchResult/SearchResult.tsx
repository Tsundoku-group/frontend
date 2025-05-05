import React, {useState} from "react";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {LibraryBig, User} from "lucide-react";

type Props = {
    search: string,
}

const SearchBar = ({search}: Props) => {
    const [activeTab, setActiveTab] = useState<string>('shelves');

    return (
        <>
            <p>{search}</p>
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
                        value="profiles"
                        className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                    >
                        <User className="w-4 h-4 mr-2"/>
                        Profiles
                    </TabsTrigger>
                </TabsList>

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
            </Tabs>
        </>
    )
}

export default SearchBar;
