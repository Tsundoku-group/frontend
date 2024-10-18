'use client';

import React, {useState, useCallback, useMemo} from "react";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArchiveRestore, BellOff, EllipsisVertical, Trash2, User} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {formatDistanceToNow, parseISO} from "date-fns";
import {fr} from "date-fns/locale";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    handleArchiveConversation,
    handleDeleteConversation,
    handleMuteConversationDuration,
    handleUnmuteConversation
} from "@/app/(main)/(chat)/conversations/actions";
import {toast} from "@/components/ui/use-toast";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";

type Props = {
    id: string;
    imageUrl: string;
    username: string;
    lastMessageContent: string;
    lastMessageSender: string;
    sentAt: string;
    isRead: boolean;
    isMutedUntil: {
        date: string;
        timezone: string;
        timezone_type: number;
    } | null;
};

const DMConversationItem = React.memo(({id, imageUrl, username, lastMessageContent, lastMessageSender, sentAt, isRead, isMutedUntil}: Props) => {
    const [openMuteDialog, setOpenMuteDialog] = useState(false);

    const parsedDate = useMemo(() => sentAt ? parseISO(sentAt) : null, [sentAt]);
    const timeAgo = useMemo(() => parsedDate ? formatDistanceToNow(parsedDate, {
        addSuffix: true,
        locale: fr
    }) : "", [parsedDate]);
    const isLastMessageFromCurrentUser = lastMessageSender === "Vous : ";
    const displayReadStatus = isLastMessageFromCurrentUser || isRead;

    const isMuted = useMemo(() => isMutedUntil && new Date(isMutedUntil.date) > new Date(), [isMutedUntil]);
    const muteDuration = useMemo(() => isMutedUntil ? new Date(isMutedUntil.date).toLocaleString() : "Inconnue", [isMutedUntil]);

    const handleMutedClick = useCallback(() => setOpenMuteDialog(true), []);

    const handleMuteDurationSelect = async (duration: number | string) => {
        try {
            await handleMuteConversationDuration(id, duration);
            toast({variant: "default", description: "Conversation mise en sourdine !"});
            setOpenMuteDialog(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: (error as Error).message || "Il y a eu un problème avec votre demande."
            });
        }
    };

    const handleUnmute = async () => {
        try {
            await handleUnmuteConversation(id);
            toast({variant: "default", description: "Cette conversation n'est plus en sourdine !"});
            setOpenMuteDialog(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: (error as Error).message || "Il y a eu un problème avec votre demande."
            });
        }
    };

    const handleDeleteClick = useCallback(async () => {
        try {
            await handleDeleteConversation(id);
            toast({variant: "default", description: "Conversation supprimée !"});
        } catch {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une conversation n'a pas pu être supprimée."
            });
        }
    }, [id]);

    const handleArchiveClick = useCallback(async () => {
        try {
            await handleArchiveConversation(id);
            toast({variant: "default", description: "Conversation archivée !"});
        } catch {
            toast({variant: "destructive", title: "Erreur", description: "Une conversation n'a pas pu être archivée."});
        }
    }, [id]);

    return (
        <Link href={`/conversations/${id}`} as={`/conversations/${id}`} className="w-full" passHref>
            <Card className="p-3 flex flex-row items-center gap-3 bg-transparent hover:bg-neutral-800 transition mb-2">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={imageUrl}/>
                    <AvatarFallback>
                        <User/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <h4 className={`truncate font-semibold text-sm ${isMuted ? 'text-black' : displayReadStatus ? 'text-black' : 'text-red-500'}`}>
                        {username}
                    </h4>
                    <span className={`text-xs text-gray-400 truncate overflow-hidden max-w-[200px]`}>
                        {isLastMessageFromCurrentUser ? (
                            <span className="font-semibold">{lastMessageSender}</span>
                        ) : (
                            <span>{lastMessageSender}: </span>
                        )}
                        <span className="truncate">{lastMessageContent}</span>
                    </span>
                </div>
                <div className="ml-auto flex-shrink-0">
                    <div className="flex items-center space-x-1">
                        {isMuted && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span className="text-gray-400 cursor-pointer">
                                        <BellOff className="items-center w-5 h-5 mr-2 font-light p-0.5"/>
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    Sourdine jusqu&apos;au : {muteDuration}
                                </HoverCardContent>
                            </HoverCard>
                        )}
                        {lastMessageContent && (
                            <span className="text-xs text-gray-400">
                                <Badge className="text-[10px] font-light p-0.5">{timeAgo}</Badge>
                            </span>
                        )}
                        {!isMuted && !displayReadStatus && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-xs cursor-pointer"
                                      onPointerDown={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4"/>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleMutedClick}>
                                    Sourdine<BellOff className="h-4 w-4 ml-7"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleArchiveClick}>
                                    Archives<ArchiveRestore className="h-4 w-4 ml-8"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDeleteClick}>
                                    Supprimer<Trash2 className="h-4 w-4 ml-5"/>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Dialog open={openMuteDialog} onOpenChange={setOpenMuteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Choisir la durée de la sourdine</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {[1, 3, 8, 24, 'eternal'].map((duration) => (
                                    <Button key={duration} onClick={() => handleMuteDurationSelect(duration)}>
                                        {duration === 'eternal' ? 'Jusqu’à ce que je le change' : `${duration} heure${typeof duration === 'number' && duration > 1 ? 's' : ''}`}
                                    </Button>
                                ))}
                            </div>
                            {isMuted && (
                                <Button onClick={handleUnmute} variant="secondary">
                                    Annuler la sourdine
                                </Button>
                            )}
                            <DialogFooter>
                                <Button onClick={() => setOpenMuteDialog(false)}>Annuler</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </Card>
        </Link>
    );
});

export default DMConversationItem;