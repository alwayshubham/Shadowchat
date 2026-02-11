"use client";

import { useChat } from "@/context/ChatContext";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Send, Smile, Paperclip, MoreVertical } from "lucide-react";

export default function ChatWindow({ recipient }: any) {
    const { data: session }: any = useSession();
    const { messages, sendMessage, sendTyping, typingUsers, onlineUsers, setChatId } = useChat();
    const [inputText, setInputText] = useState("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isOnline = onlineUsers[recipient._id] || recipient.isOnline;

    useEffect(() => {
        if (recipient._id && session?.user?.id) {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            axios.get(`${backendUrl}/api/chats/between/${session.user.id}/${recipient._id}`)
                .then(res => {
                    setChatId(res.data._id);
                    return axios.get(`${backendUrl}/api/chats/${res.data._id}/messages`);
                })
                .then(res => setChatMessages(res.data))
                .catch(err => console.error(err));
        }
    }, [recipient._id, session?.user?.id]);

    useEffect(() => {
        setChatMessages([...messages]);
    }, [messages]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSend = () => {
        if (inputText.trim() && isOnline) {
            sendMessage(recipient._id, inputText);
            setInputText("");
            sendTyping(recipient._id, false);
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        sendTyping(recipient._id, e.target.value.length > 0);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-r-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={recipient.avatar} alt={recipient.anonymousName} className="w-10 h-10 rounded-xl bg-gray-100" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-300"
                            }`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{recipient.anonymousName}</h3>
                        <p className="text-xs text-gray-500">
                            {isOnline ? "Active now" : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <img src={recipient.avatar} className="w-20 h-20 mb-3 grayscale opacity-30" />
                        <p className="text-gray-500 max-w-xs">This is the start of your anonymous chat with {recipient.anonymousName}.</p>
                    </div>
                )}
                {chatMessages.map((msg, i) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${isMe
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {typingUsers[recipient._id] && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse text-xs font-medium">
                            Typing...
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
                {!isOnline ? (
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl text-center">
                        <p className="text-sm text-orange-700 font-medium">
                            You can only chat when both of you are online.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-2xl">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Smile size={20} />
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleTyping}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-gray-800"
                        />
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className={`p-2 rounded-xl transition-all duration-200 ${inputText.trim() ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 text-gray-400"
                                }`}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
