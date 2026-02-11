"use client";

import { signIn } from "next-auth/react";
import { LogIn, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        const signupParam = searchParams.get("signup");

        if (errorParam === "CredentialsSignin") {
            setError("Login failed. Email not found or error occurred.");
        }
        if (signupParam === "success") {
            setSuccess("Account created successfully! You can now log in.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");
        setSuccess("");

        const result = await signIn("credentials", {
            email,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/chat");
        } else {
            setError("User not found or connection error. Please sign up if you haven't.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to <span className="text-blue-600">ShadowChat</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with your registered email.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-4 text-left">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-xl text-sm font-medium">
                            {success}
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
                            <LogIn className="h-5 w-5 text-blue-300 group-hover:text-blue-200" aria-hidden="true" />
                        </span>
                        {loading ? "Signing in..." : "Join Chat"}
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                            Sign up here
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
