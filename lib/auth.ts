import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import User from "@/models/user";
import { connectDatabase } from "./db";
export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialProvider({
            name: "credential_name",
            credentials: {
                email: {
                    label: 'Email', type: "text"
                },
                password: {
                    label: 'Password', type: "password"
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("missing Email or password")
                }

                try {
                    await connectDatabase()
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("no user found with this ")
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValidPassword) {
                        throw new Error("invaid password ")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    console.error("auth error", error)
                    throw new Error("an error occured")
                }
            },

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages:{
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}; 