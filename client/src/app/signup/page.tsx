"use client";

import { LogIn, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            await axios.post(`${backendUrl}/api/users/register`, {
                email,
            });
            // Registration successful, redirect to login
            router.push("/login?signup=success");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.response?.data?.error || "Registration failed. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create <span className="text-blue-600">Account</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up to chat anonymously with your email.
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="mt-8 space-y-4 text-left">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all text-gray-900"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${loading || !email ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
                            }`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserPlus className="h-5 w-5 text-blue-300 group-hover:text-blue-200" aria-hidden="true" />
                        </span>
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center text-gray-400 text-xs">
                &copy; 2026 ShadowChat. Built with Next.js & Socket.IO.
            </div>
        </div>
    );
}
