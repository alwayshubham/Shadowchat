"use client";

import { useChat } from "@/context/ChatContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Circle } from "lucide-react";

export default function UserList({ onSelectUser, selectedUserId }: any) {
    const { data: session }: any = useSession();
    const { onlineUsers } = useChat();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (session?.user?.id) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/users?exclude=${session.user.id}`)
                .then(res => setUsers(res.data))
                .catch(err => console.error(err));
        }
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-800">Messages</h2>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {users.length} Users
                </span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedUserId === user._id ? "bg-blue-50 border-r-4 border-blue-500" : "hover:bg-gray-50"
                            }`}
                    >
                        <div className="relative">
                            <img src={user.avatar} alt={user.anonymousName} className="w-12 h-12 rounded-xl bg-gray-100" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${onlineUsers[user._id] || user.isOnline ? "bg-green-500" : "bg-gray-300"
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.anonymousName}</p>
                            <p className={`text-xs ${onlineUsers[user._id] || user.isOnline ? "text-green-600 font-medium" : "text-gray-500"}`}>
                                {onlineUsers[user._id] || user.isOnline ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-gray-50 border-t flex items-center gap-3">
                <img src={session?.user?.avatar} className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-1 truncate">
                    <p className="text-sm font-bold truncate">{session?.user?.anonymousName}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                </div>
            </div>
        </div>
    );
}
