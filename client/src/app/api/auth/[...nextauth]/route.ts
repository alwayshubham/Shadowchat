import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

                    // Check if user exists in backend
                    const { data } = await axios.post(`${backendUrl}/api/users/login`, {
                        email: credentials.email,
                    });

                    return {
                        id: data._id,
                        email: data.email,
                        anonymousName: data.anonymousName,
                        avatar: data.avatar,
                    };
                } catch (error: any) {
                    console.error("Login authorization error:", error.response?.data?.error || error.message);
                    return null; // Returning null fails the authentication
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.anonymousName = user.anonymousName;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.anonymousName = token.anonymousName;
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
