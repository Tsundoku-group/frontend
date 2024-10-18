import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Message from "@/app/(main)/(chat)/conversations/[conversationId]/components/message/Message";
import { Loader2 } from "lucide-react";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";
import { useSocket } from "@/context/socketContext";
import {fetchMessagesFromConversationId} from "@/app/(main)/(chat)/conversations/actions";

type Props = {
    messages: MessageType[];
    conversationId: string;
    userEmail: string;
};

type MessageType = {
    id: string;
    content: string;
    sent_by: string;
    sender_id: string;
    sent_at: string;
    isCurrentUser: boolean;
    isRead?: boolean;
};

const Body = ({ messages, conversationId, userEmail }: Props) => {
    const [localMessages, setLocalMessages] = useState<MessageType[]>(messages);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const socket = useSocket();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const lastMessageByUser = useMemo(() => {
        const lastMessages: Record<string, number> = {};
        if (Array.isArray(localMessages)) {
            localMessages.forEach((message, index) => {
                lastMessages[message.sender_id] = index;
            });
        }
        return lastMessages;
    }, [localMessages]);

    const firstUnreadMessageIndex = useMemo(() => {
        return localMessages.findIndex((message) => message.sender_id !== userEmail && !message.isRead);
    }, [localMessages, userEmail]);

    useEffect(() => {
        if (socket && conversationId) {
            socket.emit('joinRoom', conversationId);

            socket.on('receive_msg', (data: any) => {
                const { roomId } = data;
                if (roomId === conversationId) {
                    setLocalMessages((prevMessages) => [...prevMessages, data]);
                }
            });

            socket.on('typing', ({ userId }: { userId: string }) => {
                if (userId !== userEmail) {
                    setIsOtherUserTyping(true);
                }
            });

            socket.on('stopTyping', ({ userId }: { userId: string }) => {
                if (userId !== userEmail) {
                    setIsOtherUserTyping(false);
                }
            });

            return () => {
                socket.off('receive_msg');
                socket.off('typing');
                socket.off('stopTyping');
            };
        }
    }, [socket, conversationId, userEmail]);

    const loadMoreMessages = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            const newMessages = await fetchMessagesFromConversationId(conversationId, page + 1);
            if (newMessages.length > 0) {
                setLocalMessages((prevMessages) => [...newMessages, ...prevMessages]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Erreur lors du chargement de plus de messages :", error);
        } finally {
            setLoading(false);
        }
    }, [loading, conversationId, page]);

    useEffect(() => {
        const handleScroll = async () => {
            if (messageContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;

                setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);

                if (scrollTop === 0 && !loading) {
                    await loadMoreMessages();
                }
            }
        };

        const containerRef = messageContainerRef.current;
        if (containerRef) {
            containerRef.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (containerRef) {
                containerRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, loadMoreMessages]);

    useEffect(() => {
        if (messageContainerRef.current && localMessages.length > 0 && isAtBottom) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [localMessages, isAtBottom]);

    // Met à jour localMessages si les props `messages` changent
    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    return (
        <div ref={messageContainerRef} className="flex-1 w-full flex overflow-y-scroll flex-col gap-2 p-3 no-scrollbar">
            {loading && (
                <div className="flex justify-center mb-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            )}

            {!isAtBottom && (
                <ScrollToBottomButton
                    onClick={() => {
                        if (messageContainerRef.current) {
                            messageContainerRef.current.scrollTo({
                                top: messageContainerRef.current.scrollHeight,
                                behavior: 'smooth'
                            });
                            setIsAtBottom(true);
                        }
                    }}
                />
            )}

            {localMessages.map((message, index) => {
                const isLastByUser = lastMessageByUser[message.sender_id] === index;
                const isLastByMessages = index === localMessages.length - 1;
                const isRead = message.isRead;

                return (
                    <div key={message.id}>
                        {(index === firstUnreadMessageIndex && message.sender_id !== userEmail) && (
                            <div className="flex items-center py-2">
                                <div className="flex-grow border-t border-red-500"></div>
                                <div className="px-4 py-1 bg-red-500 text-white text-sm">
                                    Nouveau message
                                </div>
                                <div className="flex-grow border-t border-red-500"></div>
                            </div>
                        )}

                        <Message
                            fromCurrentUser={message.isCurrentUser}
                            lastByUser={isLastByUser}
                            content={message.content}
                            sent_at={message.sent_at}
                            lastByMessages={isLastByMessages}
                            isRead={isRead}
                        />
                    </div>
                );
            })}

            {isOtherUserTyping && (
                <div className="px-2 text-gray-500 text-xs">est en train d&apos;écrire...</div>
            )}
        </div>
    );
};

export default Body;