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
} from "@/server-actions/main/chat/conversations/actions";
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
import {truncateString} from "@/utils/string-utils";

type Props = {
    id: number;
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
    otherParticipantId?: number;
};

const DMConversationItem = React.memo(({
                                           id,
                                           imageUrl,
                                           username,
                                           lastMessageContent,
                                           lastMessageSender,
                                           sentAt,
                                           isRead,
                                           isMutedUntil,
                                           setConversations,
                                           otherParticipantId
                                       }: Props) => {
    const [openMuteDialog, setOpenMuteDialog] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const router = useRouter();
    const {socket} = useSocket();

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
            ShowToast("default", "Cette conversations n'est plus en sourdine !");
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
            ShowToast("destructive", "Erreur lors de la suppression de la conversations.", "Erreur");
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
            ShowToast("destructive", "Erreur", "Une conversations n'a pas pu être archivée.");
        }
    }, [id, setConversations]);

    useEffect(() => {
        if (socket) {
            socket.on("user_status_update", ({profileId, status}) => {
                if (otherParticipantId === profileId) {
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
                  className="p-3 flex flex-row items-center gap-3 bg-tertiary-black border-none hover:bg-primary-black transition mb-2">
                <div className="relative">
                    <Avatar>
                        <AvatarImage src={imageUrl}/>
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
                    <div
                        className={`truncate font-semibold text-sm ${isMuted ? 'text-text-white' : displayReadStatus ? 'text-text-white' : 'text-red-highlight'}`}>
                        {username}
                    </div>
                    <span className={`text-xs text-text-white truncate overflow-hidden max-w-[200px]`}>
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
                            <span className="text-xs text-text-white">
                                <Badge
                                    className="text-[10px] font-light p-0.5 bg-primary-black">{truncateString(timeAgo, 10)}</Badge>
                            </span>
                        )}
                        {!isMuted && !displayReadStatus && (
                            <span className="w-2 h-2 bg-red-highlight rounded-full"></span>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="text-xs cursor-pointer"
                                      onClick={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4 text-text-white"/>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-tertiary-black border-secondary-black">
                                {[
                                    { label: "Sourdine", icon: <BellOff className="h-4 w-4" />, onClick: handleMutedClick },
                                    { label: "Archives", icon: <ArchiveRestore className="h-4 w-4" />, onClick: handleArchiveClick },
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

                    <Dialog open={openMuteDialog} onOpenChange={setOpenMuteDialog}>
                        <DialogContent className="bg-tertiary-black border border-secondary-black rounded-xl shadow-lg">
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-white text-lg">Choisir la durée de la sourdine</DialogTitle>
                                <DialogDescription className="text-gray-400 text-sm">
                                    Cette action mettra la conversation en sourdine pour la durée choisie.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[1, 3, 8, 24].map((duration) => (
                                    <Button
                                        key={duration}
                                        onClick={() => handleMuteDurationSelect(duration)}
                                        className="bg-primary-black hover:bg-primary transition text-white border border-secondary-black rounded-md py-2 text-sm"
                                    >
                                        {duration} heure{duration > 1 && 's'}
                                    </Button>
                                ))}
                                <Button
                                    onClick={() => handleMuteDurationSelect('eternal')}
                                    className="col-span-2 bg-secondary-black hover:bg-secondary border border-secondary-black text-white rounded-md py-2 text-sm"
                                >
                                    Jusqu’à ce que je le change
                                </Button>
                            </div>

                            {isMuted && (
                                <Button
                                    onClick={handleUnmute}
                                    variant="secondary"
                                    className="w-full bg-red-highlight text-white hover:bg-red-600 transition"
                                >
                                    Annuler la sourdine
                                </Button>
                            )}

                            <DialogFooter className="mt-4">
                                <Button
                                    onClick={() => setOpenMuteDialog(false)}
                                    className="bg-gray-600 text-white hover:bg-gray-700"
                                >
                                    Annuler
                                </Button>
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