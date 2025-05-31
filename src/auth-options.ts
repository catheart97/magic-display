import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Configuration } from "@/configuration";

export const providers = [
  CredentialsProvider({
    name: "password",
    credentials: {
      password: {
        label: "Password",
        type: "password",
      },
    },
    async authorize(credentials, _request) {
      if (credentials?.password == Configuration.adminPassword) {
        return { id: "0" };
      } else {
        return null;
      }
    },
  }),
];

export const providerMap = Object.fromEntries(
  providers.map((provider) => [provider.id, provider]),
);

export const AuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: Configuration.serverSecret,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
} as NextAuthOptions;
