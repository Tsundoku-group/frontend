'use client'

import {useQuery} from '@tanstack/react-query'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {fetchMembersFromGroup} from "@/app/(main)/(groups)/clubs/[slug]/actions";
import {truncateString} from "@/utils/string-utils";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {useProfileContext} from "@/context/profileContext";
import React, {useState} from "react";
import {GroupMember} from "@/models/GroupMember";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface Props {
    groupId: number;
}

function formatJoinDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

export default function GroupMembersContent({groupId}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const {activeProfileInStorage} = useProfileContext();
    const profileId = activeProfileInStorage?.id as number;
    const router = useRouter();

    const {data: members = [], isLoading, isError} = useQuery<GroupMember[]>({
        queryKey: ['group-members', groupId],
        queryFn: () => fetchMembersFromGroup(groupId),
        staleTime: 1000 * 60 * 5,
        enabled: !!groupId,
    });

    const currentMember = members.find((member) => member.id === profileId);

    const filteredMembers = members.filter((member) => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            member.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleViewProfile = (memberId: number) => {
        router.push(`/profile/${memberId}`);
    };

    const admins = filteredMembers.filter(
        (member) => member.roleLabel === "Administrateur" && member.id !== profileId
    );

    const regulars = filteredMembers.filter(
        (member) => member.roleLabel === "Membre" && member.id !== profileId
    );

    if (isLoading) {
        return <p className="text-gray-400 italic">Chargement des membres...</p>;
    }

    if (isError) {
        return <p className="text-red-500">Erreur lors du chargement des membres</p>;
    }

    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Membres - {filteredMembers.length}</h3>
            <Input
                placeholder="🔍 Rechercher un membre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 w-full bg-tertiary-black border-none"
            />

            <div className="border-t border-gray-700 my-6"/>

            {currentMember && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div
                        key={currentMember.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-secondary-black p-3 rounded-md border border-gray-700"
                    >
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={currentMember.avatarUrl || ""}/>
                            <AvatarFallback>{currentMember.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex gap-1">
                            <span className="text-sm font-medium text-white">
                                {truncateString(`${currentMember.firstName} ${currentMember.lastName}`, 30)}
                            </span>
                            </div>
                            <div className="text-xs text-gray-400">@{currentMember.username}</div>
                            <Badge className="w-fit mt-1 text-xs font-medium">{currentMember.roleLabel}</Badge>
                            <span className="text-xs text-gray-500">
                            Membre depuis le {formatJoinDate(currentMember.joinAt.date)}
                        </span>
                            <Button className="w-fit mt-2" onClick={() => handleViewProfile(currentMember.id)}>Voir mon profil</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border-t border-gray-700 my-6"/>
            <h6 className="text-lg font-semibold mb-2">Administrateurs - {admins.length}</h6>

            <div className="grid grid-cols-1 gap-4 mb-6">
                {admins.length > 0 ? admins.map((member) => (
                    <div
                        key={member.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-secondary-black p-3 rounded-md border border-gray-700"
                    >
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={member.avatarUrl || ""}/>
                            <AvatarFallback>{member.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex gap-1">
                          <span className="text-sm font-medium text-white">
                            {truncateString(`${member.firstName} ${member.lastName}`, 30)}
                          </span>
                            </div>
                            <div className="text-xs text-gray-400">@{member.username}</div>
                            <Badge className="w-fit mt-1 text-xs font-medium">{member.roleLabel}</Badge>
                            <span className="text-xs text-gray-500">
                            Membre depuis le {formatJoinDate(member.joinAt.date)}
                        </span>
                            <Button className="w-fit mt-2" onClick={() => handleViewProfile(member.id)}>Voir le profil</Button>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 italic">Aucun administrateur trouvé.</p>
                )}
            </div>

            <div className="border-t border-gray-700 my-6"/>
            <h6 className="text-lg font-semibold mb-2">Membres - {regulars.length}</h6>

            <div className="grid grid-cols-1 gap-4">
                {regulars.length > 0 ? regulars.map((member) => (
                    <div
                        key={member.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-secondary-black p-3 rounded-md border border-gray-700"
                    >
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={member.avatarUrl || ""}/>
                            <AvatarFallback>{member.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex gap-1">
                          <span className="text-sm font-medium text-white">
                            {truncateString(`${member.firstName} ${member.lastName}`, 30)}
                          </span>
                            </div>
                            <div className="text-xs text-gray-400">@{member.username}</div>
                            <Badge className="w-fit mt-1 text-xs font-medium">{member.roleLabel}</Badge>
                            <span className="text-xs text-gray-500">
                            Membre depuis le {formatJoinDate(member.joinAt.date)}
                        </span>
                            <Button className="w-fit mt-2" onClick={() => handleViewProfile(member.id)}>Voir le profil</Button>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 italic">Aucun membre trouvé.</p>
                )}
            </div>
        </>
    );
}