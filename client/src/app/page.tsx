"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Shield, Zap, Lock, ArrowRight, UserPlus } from "lucide-react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-200">
            <MessageSquare size={24} />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-tight">ShadowChat</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-200/50 transition-all hover:-translate-y-0.5">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-sm font-semibold mb-8 border border-blue-200">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Now with anonymous chat features
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
          Connect freely with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            complete privacy.
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          ShadowChat is a modern, secure messaging platform designed for real-time conversations. Chat with anyone, anonymously and securely.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1">
            <UserPlus size={20} />
            Start Chatting Now
          </Link>
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm border border-gray-200 transition-all hover:-translate-y-1">
            Log into Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why choose ShadowChat?</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Everything you need to have meaningful, fast, and secure conversations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50 hover:shadow-lg hover:shadow-blue-100/50 transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-200">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Messages are delivered instantly. See when others are typing in real-time without any lag.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50 hover:shadow-lg hover:shadow-indigo-100/50 transition-all">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Anonymous & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your identity is protected. We use anonymous names and avatars to keep your real identity hidden.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50/50 p-8 rounded-3xl border border-purple-100/50 hover:shadow-lg hover:shadow-purple-100/50 transition-all">
              <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-200">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Presence Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Only chat with users who are currently online. No more waiting days for a response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-10 border-t border-gray-100 text-center">
        <p className="text-gray-500 font-medium">© {new Date().getFullYear()} ShadowChat. All rights reserved.</p>
      </footer>
    </div>
  );
}
