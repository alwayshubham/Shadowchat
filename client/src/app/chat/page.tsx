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
        <div className="h-screen bg-gray-100 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 flex flex-col h-full shadow-lg z-10">
                <UserList
                    onSelectUser={setSelectedRecipient}
                    selectedUserId={selectedRecipient?._id}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-gray-50">
                {/* Top Navbar */}
                <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <MessageSquare size={20} />
                        </div>
                        <h1 className="font-bold text-xl text-gray-800">ShadowChat</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Settings size={20} />
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-hidden">
                    {selectedRecipient ? (
                        <ChatWindow recipient={selectedRecipient} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 text-center p-10 shadow-sm">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                            <p className="text-gray-500 max-w-sm">
                                Choose a user from the sidebar to start chatting. Remember, you can only chat when both of you are online!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
