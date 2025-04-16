'use client'

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs"
import {List, Users, Activity} from "lucide-react";
import React from "react";
import GroupAboutContent from "@/app/(main)/(groups)/clubs/[slug]/components/content/GroupAboutContent";
import GroupMembersContent from "@/app/(main)/(groups)/clubs/[slug]/components/content/GroupMembersContent";
import GroupActivityContent from "@/app/(main)/(groups)/clubs/[slug]/components/content/GroupActivityContent";
import {GroupData} from "@/models/GroupData";

interface GroupAboutSectionProps {
    group: GroupData;
    isLoading: boolean;
    isError: boolean;
}

export default function GroupTabs({group}: GroupAboutSectionProps) {
    return (
        <Tabs defaultValue="activity" className="w-full mt-4">
            <TabsList className="bg-transparent w-full justify-start gap-6 px-0">
                <TabsTrigger
                    value="activity"
                    className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                >
                    <Activity className="w-4 h-4 mr-2"/>
                    Discussion
                </TabsTrigger>
                <TabsTrigger
                    value="members"
                    className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                >
                    <Users className="w-4 h-4 mr-2"/>
                    Membres
                </TabsTrigger>
                <TabsTrigger
                    value="about"
                    className="text-gray-600 px-4 py-2 rounded-md focus:bg-tertiary-black data-[state=active]:bg-tertiary-black focus:text-white data-[state=active]:text-white"
                >
                    <List className="w-4 h-4 mr-2"/>
                    A propos
                </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-4">
                <GroupActivityContent groupId={group.id}/>
            </TabsContent>
            <TabsContent value="members" className="mt-4">
                <GroupMembersContent groupId={group.id}/>
            </TabsContent>
            <TabsContent value="about" className="mt-4">
                <GroupAboutContent group={group} isLoading={false} isError={false} />
            </TabsContent>
        </Tabs>
    )
}