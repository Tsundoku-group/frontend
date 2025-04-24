import React from "react";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArchiveRestore, EllipsisVertical, Trash2, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {handleDeleteConversation} from "@/server-actions/main/chat/conversations/actions";
import {handleUnarchiveConversation} from "@/server-actions/main/chat/archives/actions";
import {Checkbox} from "@/components/ui/checkbox";
import {ShowToast} from "@/components/ShowToast";
import {ChatConversation} from "@/models/ChatConversation";
import {useRouter} from "next/navigation";
import {formatDate} from "@/utils/dateUtils";

type Props = {
    id: number;
    imageUrl: string;
    username: string;
    lastMessageContent: string;
    lastMessageSender: string;
    archivedAt: string;
    isChecked: boolean;
    onChange: () => void;
    setArchivesConversation: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
};

const ArchivesConversationItem = React.memo(({id, imageUrl, username, lastMessageContent, lastMessageSender, archivedAt, isChecked, onChange, setArchivesConversation}: Props) => {
    const router = useRouter();

    const handleDeleteClick = async () => {
        try {
            await handleDeleteConversation(id);
            ShowToast("default", "Conversation supprimée !");
        } catch (error) {
            ShowToast("destructive", "Une conversations n'a pas pu être supprimée.", "Erreur");
        }
    };

    const handleRestoreClick = async () => {
        try {
            await handleUnarchiveConversation(id);

            setArchivesConversation(prevConversations =>
                prevConversations.filter(conv => conv.id !== id)
            );

            ShowToast("default", "Conversation restaurée !");
        } catch (error) {
            ShowToast("destructive", "Une conversations n'a pas pu être restaurée.", "Erreur");
        }
    };

    return (
        <div className="w-full">
            <Card onClick={() => router.push(`/archives/${id}`)} className="p-3 flex flex-row items-center gap-3 bg-tertiary-black hover:bg-primary-black transition border-none">
                <Checkbox id={id.toString()} checked={isChecked} onChange={onChange}/>
                <Avatar>
                    <AvatarImage src={imageUrl}/>
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <div className="truncate font-semibold text-sm text-text-white">{username}</div>
                    {lastMessageSender && lastMessageContent && (
                        <span className="text-xs text-gray-400 truncate overflow-hidden max-w-[200px]">
                            <span>{lastMessageSender}: </span>
                            <span className="truncate">{lastMessageContent}</span>
                        </span>
                    )}
                </div>
                <div className="ml-auto flex-shrink-0">
                    <div className="flex items-center space-x-1">
                        {archivedAt && (
                            <span className="text-xs text-gray-400">
                                <Badge className="text-[10px] font-light p-0.5">{formatDate(archivedAt)}</Badge>
                            </span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-xs cursor-pointer"
                                      onClick={(event) => event.stopPropagation()} >
                                    <EllipsisVertical className="h-4 w-4 text-text-white"/>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-tertiary-black border-secondary-black">
                                {[
                                    { label: "Restaurer", icon: <ArchiveRestore className="h-4 w-4" />, onClick: handleRestoreClick },
                                    { label: "Supprimer", icon: <Trash2 className="h-4 w-4" />, onClick: handleDeleteClick },
                                ].map(({ label, icon, onClick }, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            void onClick();
                                        }}
                                        className="text-text-white hover:!bg-primary-black hover:!text-text-white"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span>{label}</span>
                                            <span>{icon}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Card>
        </div>
    );
});

ArchivesConversationItem.displayName = 'ArchivesConversationItem';

export default ArchivesConversationItem;