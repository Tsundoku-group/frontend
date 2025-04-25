'use client'

import {useQuery} from '@tanstack/react-query'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {fetchMembersFromGroup} from "@/server-actions/main/groups/clubs/actions";
import {truncateString} from "@/utils/string-utils";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {useProfileContext} from "@/context/profileContext";
import React, {useState} from "react";
import {GroupMember} from "@/models/GroupMember";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useSocket} from "@/context/socketContext";

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

const GroupMemberItem = ({member, onClick}: { member: GroupMember; onClick: () => void }) => {
    const {onlineProfileIds} = useSocket();
    const isOnline = onlineProfileIds.includes(member.id);

    return (
        <div
            key={member.id}
            className="flex items-center gap-4 bg-secondary-black p-4 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="relative w-12 h-12 shrink-0">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatarUrl || ""}/>
                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                </Avatar>
                <span
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-secondary-black rounded-full ${
                        isOnline ? "bg-green-highlight" : "bg-gray-500"
                    }`}
                    title={isOnline ? "En ligne" : "Hors ligne"}
                />
            </div>

            <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2 truncate">
                    <span className="text-base font-semibold text-white truncate">
                        {truncateString(`${member.firstName} ${member.lastName}`, 25)}
                    </span>
                    {isOnline && <span className="text-xs text-green-highlight ml-2">(en ligne)</span>}
                </div>
                <span className="text-xs text-gray-400">@{member.username}</span>
                <Badge
                    className="w-fit mt-1 text-xs font-medium bg-tertiary-black text-gray-300 border-gray-600"
                    variant="secondary"
                >
                    {member.roleLabel}
                </Badge>
                <span className="text-xs text-gray-500 mt-0.5">
                    Membre depuis le {formatJoinDate(member.joinAt.date)}
                </span>
            </div>

            <div className="ml-auto">
                <Button variant="secondary" size="sm" onClick={onClick}>
                    Voir
                </Button>
            </div>
        </div>
    );
};

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
                    <GroupMemberItem
                        key={currentMember.id}
                        member={currentMember}
                        onClick={() => handleViewProfile(currentMember.id)}
                    />
                </div>
            )}

            <div className="border-t border-gray-700 my-6"/>
            <h6 className="text-lg font-semibold mb-2">Administrateurs - {admins.length}</h6>

            <div className="grid grid-cols-1 gap-4 mb-6">
                {admins.length > 0 ? admins.map((member) => (
                    <GroupMemberItem key={member.id} member={member} onClick={() => handleViewProfile(member.id)}/>
                )) : (
                    <p className="text-sm text-gray-500 italic">Aucun administrateur trouvé.</p>
                )}
            </div>

            <div className="border-t border-gray-700 my-6"/>
            <h6 className="text-lg font-semibold mb-2">Membres - {regulars.length}</h6>

            <div className="grid grid-cols-1 gap-4">
                {regulars.length > 0 ? regulars.map((member) => (
                    <GroupMemberItem key={member.id} member={member} onClick={() => handleViewProfile(member.id)}/>
                )) : (
                    <p className="text-sm text-gray-500 italic">Aucun membre trouvé.</p>
                )}
            </div>
        </>
    );
}