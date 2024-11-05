'use client';

import React, {useState, useCallback, useMemo, useEffect} from "react";
import {Card} from "@/components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {ShowToast} from "@/components/ShowToast";
import {useRouter} from "next/navigation";
import {ChatConversation} from "@/models/ChatConversation";
import {useSocket} from "@/context/socketContext";

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
    setConversations: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
    otherParticipantId?: string;
};

const DMConversationItem = React.memo(({id, imageUrl, username, lastMessageContent, lastMessageSender, sentAt, isRead, isMutedUntil, setConversations, otherParticipantId}: Props) => {
    const [openMuteDialog, setOpenMuteDialog] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const router = useRouter();
    const socket = useSocket();

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

    const handleMuteDurationSelect = useCallback(async (duration: number | string) => {
        try {
            const response = await handleMuteConversationDuration(id, duration);
            const muteUntilDate = response.data.duration as string;

            ShowToast("default", "Conversation mise en sourdine !");
            setOpenMuteDialog(false);

            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === id
                        ? {...conv, isMutedUntil: {date: muteUntilDate, timezone: "UTC", timezone_type: 3}}
                        : conv
                )
            );
        } catch (error) {
            ShowToast("destructive", (error as Error).message || "Erreur lors de la mise en sourdine.", "Erreur");
        }
    }, [id, setConversations]);

    const handleUnmute = useCallback(async () => {
        try {
            await handleUnmuteConversation(id);
            ShowToast("default", "Cette conversation n'est plus en sourdine !");
            setOpenMuteDialog(false);

            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === id
                        ? {...conv, isMutedUntil: null}
                        : conv
                )
            );
        } catch (error) {
            ShowToast("destructive", (error as Error).message || "Erreur lors de la désactivation de la sourdine.", "Erreur");
        }
    }, [id, setConversations]);

    const handleDeleteClick = useCallback(async () => {
        try {
            await handleDeleteConversation(id);
            ShowToast("default", "Conversation supprimée !");

            setConversations(prevConversations => prevConversations.filter(conv => conv.id !== id));
        } catch (error) {
            ShowToast("destructive", "Erreur lors de la suppression de la conversation.", "Erreur");
        }
    }, [id, setConversations]);

    const handleArchiveClick = useCallback(async () => {
        try {
            await handleArchiveConversation(id);

            setConversations(prevConversations =>
                prevConversations.filter(conv => conv.id !== id)
            );

            ShowToast("default", "Conversation archivée !");
        } catch {
            ShowToast("destructive", "Erreur", "Une conversation n'a pas pu être archivée.");
        }
    }, [id, setConversations]);

    useEffect(() => {
        if (socket) {
            socket.on("user_status_update", ({ userId, status }) => {
                if (otherParticipantId === userId) {
                    setIsOnline(status === "online");
                }
            });

            return () => {
                socket.off("user_status_update");
            };
        }
    }, [socket, otherParticipantId]);

    return (
        <div className="w-full">
            <Card onClick={() => router.push(`/conversations/${id}`)}
                  className="p-3 flex flex-row items-center gap-3 bg-transparent hover:bg-neutral-800 transition mb-2">
                <div className="relative">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>
                            <User/>
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <span
                            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                    <h4 className={`truncate font-semibold text-sm ${isMuted ? 'text-black' : displayReadStatus ? 'text-black' : 'text-red-500'}`}>
                        {username}
                    </h4>
                    <span className={`text-xs text-gray-400 truncate overflow-hidden max-w-[200px]`}>
                        {lastMessageContent ? (
                            <>
                                {isLastMessageFromCurrentUser ? (
                                    <span className="font-semibold">{lastMessageSender}</span>
                                ) : (
                                    <span>{lastMessageSender}: </span>
                                )}
                                <span className="truncate">{lastMessageContent}</span>
                            </>
                        ) : (
                            <span className="text-xs text-gray-400 font-semibold">Envoie un message...</span>
                        )}
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
                                      onClick={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4"/>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleMutedClick();
                                }}>
                                    Sourdine<BellOff className="h-4 w-4 ml-7"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(event) => {
                                    event.stopPropagation();
                                    handleArchiveClick();
                                }}>
                                    Archives<ArchiveRestore className="h-4 w-4 ml-8"/>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleDeleteClick();
                                    }}>
                                    Supprimer<Trash2 className="h-4 w-4 ml-5"/>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Dialog open={openMuteDialog} onOpenChange={setOpenMuteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Choisir la durée de la sourdine</DialogTitle>
                                <DialogDescription>Cette action mettra la conversation en sourdine pour la durée
                                    choisie.</DialogDescription>
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
        </div>
    );
});

DMConversationItem.displayName = 'DMConversationItem';

export default DMConversationItem;