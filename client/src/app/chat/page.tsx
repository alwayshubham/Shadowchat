"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserList from "@/components/UserList";
import ChatWindow from "@/components/ChatWindow";
import { MessageSquare, LogOut, Settings, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ChatPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden font-sans relative">
            {/* Sidebar */}
            <div className={`w-full md:w-80 flex-shrink-0 flex-col h-full bg-white shadow-lg z-20 ${selectedRecipient ? 'hidden md:flex' : 'flex'}`}>
                <UserList
                    onSelectUser={setSelectedRecipient}
                    selectedUserId={selectedRecipient?._id}
                />
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex-col h-full bg-gray-50 relative z-10 ${!selectedRecipient ? 'hidden md:flex' : 'flex'}`}>
                {/* Top Navbar */}
                <div className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-200">
                            <MessageSquare size={20} />
                        </div>
                        <h1 className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block">ShadowChat</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all">
                            <Settings size={20} />
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-0 md:p-4 overflow-hidden relative">
                    {selectedRecipient ? (
                        <div className="h-full bg-white md:rounded-2xl md:shadow-sm border-x-0 md:border border-gray-200 overflow-hidden">
                            <ChatWindow recipient={selectedRecipient} onBack={() => setSelectedRecipient(null)} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white md:rounded-2xl border border-dashed border-gray-300 text-center p-6 md:p-10 shadow-sm mx-0 md:mx-4 my-0 md:my-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-inner">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Select a conversation</h3>
                            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed">
                                Choose a user from the sidebar to start chatting. Remember, you can only chat when both of you are online!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
