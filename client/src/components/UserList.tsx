/* eslint-disable @typescript-eslint/no-explicit-any */
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
            const fetchUsers = (lat?: number, lng?: number) => {
                axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/users`,
                    {
                        params: {
                            exclude: session.user.id,
                            ...(lat && lng ? { lat, lng, radius: 5 } : {})
                        }
                    }
                )
                .then(res => setUsers(res.data))
                .catch(err => console.error('User fetch error:', err));
            };

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude: lat, longitude: lng } = position.coords;
                        
                        // Update own location in DB
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/users/location`, {
                            userId: session.user.id,
                            lat,
                            lng
                        }).catch(console.error);

                        // Fetch nearby users
                        fetchUsers(lat, lng);
                    },
                    (error) => {
                        console.warn("Geolocation denied or error", error);
                        fetchUsers(); // Fallback to fetching without location constraint
                    }
                );
            } else {
                fetchUsers();
            }
        }
    }, [session?.user?.id]);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            <div className="p-4 md:p-5 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-bold text-lg md:text-xl text-gray-900 tracking-tight">Messages</h2>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold shadow-sm border border-blue-100/50">
                    {users.length} Users
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className={`p-3 md:p-4 mb-1 rounded-2xl flex items-center gap-3 md:gap-4 cursor-pointer transition-all duration-200 group ${selectedUserId === user._id ? "bg-blue-600 shadow-md shadow-blue-200/50 transform scale-[1.02]" : "hover:bg-gray-50 hover:shadow-sm"
                            }`}
                    >
                        <div className="relative">
                            <img src={user.avatar} alt={user.anonymousName} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover transition-transform group-hover:scale-105 ${selectedUserId === user._id ? "bg-blue-500/50 border-2 border-white/20" : "bg-gray-100 border border-gray-200/50"}`} />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full border-2 ${selectedUserId === user._id ? "border-blue-600" : "border-white"} ${onlineUsers[user._id] || user.isOnline ? "bg-green-500 shadow-sm" : "bg-gray-300"
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-semibold truncate text-base ${selectedUserId === user._id ? "text-white" : "text-gray-900 group-hover:text-blue-600 transition-colors"}`}>{user.anonymousName}</p>
                            <p className={`text-xs md:text-sm mt-0.5 ${onlineUsers[user._id] || user.isOnline ? (selectedUserId === user._id ? "text-blue-100 font-medium" : "text-green-600 font-medium") : (selectedUserId === user._id ? "text-blue-200" : "text-gray-500")}`}>
                                {onlineUsers[user._id] || user.isOnline ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center gap-3 backdrop-blur-sm">
                <img src={session?.user?.avatar} className="w-10 h-10 rounded-xl bg-gray-200 object-cover shadow-sm border border-gray-200/50" />
                <div className="flex-1 truncate">
                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{session?.user?.anonymousName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{session?.user?.email}</p>
                </div>
            </div>
        </div>
    );
}
