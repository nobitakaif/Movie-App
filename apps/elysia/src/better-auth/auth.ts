
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@repo/db";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    database : prismaAdapter(prisma,{
        provider : "postgresql"
    })
});

import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient();
