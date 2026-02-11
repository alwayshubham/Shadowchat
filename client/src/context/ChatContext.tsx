"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface ChatContextType {
    socket: Socket | null;
    onlineUsers: Record<string, boolean>;
    typingUsers: Record<string, boolean>;
    sendMessage: (recipientId: string, text: string) => void;
    sendTyping: (recipientId: string, isTyping: boolean) => void;
    messages: any[];
    setChatId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session }: any = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [messages, setMessages] = useState<any[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

            newSocket.on('connect', () => {
                newSocket.emit('join', session.user.id);
            });

            newSocket.on('userStatus', ({ userId, isOnline }) => {
                setOnlineUsers(prev => ({ ...prev, [userId]: isOnline }));
            });

            newSocket.on('message', (message) => {
                if (message.chatId === currentChatId) {
                    setMessages(prev => [...prev, message]);
                }
            });

            newSocket.on('displayTyping', ({ senderId, isTyping }) => {
                setTypingUsers(prev => ({ ...prev, [senderId]: isTyping }));
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [session?.user?.id, currentChatId]);

    const sendMessage = (recipientId: string, text: string) => {
        if (socket) {
            socket.emit('privateMessage', { recipientId, text });
        }
    };

    const sendTyping = (recipientId: string, isTyping: boolean) => {
        if (socket) {
            socket.emit('typing', { recipientId, isTyping });
        }
    };

    return (
        <ChatContext.Provider value={{
            socket,
            onlineUsers,
            typingUsers,
            sendMessage,
            sendTyping,
            messages,
            setChatId: setCurrentChatId
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};
