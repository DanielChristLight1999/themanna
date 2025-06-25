import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { hashPassword } from "./lib/utils";
import bcrypt from "bcryptjs";
import prisma from "./db";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth} = NextAuth({
  providers: [ Credentials({
    name: "Credentials",
    credentials: {
        firstName: {label: "First Name", type: "text"},
        lastName: {label: "Last Name", type: "text"},
        phone: {label: "Phone", type: "text"},
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
    },
    authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const firstName = credentials.firstName as string;
        const lastName = credentials.lastName as string;
        const phone = credentials.phone as string;
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            const hashedPassword = hashPassword(password);
            user = await prisma.user.create({
                data: {
                  email: email,
                  passwordHash: hashedPassword,
                  name: `${firstName} ${lastName}`,
                  phone: phone,
                }
            })
            const referralCode = (await cookies()).get("referral")?.value
            if (referralCode) {
                const affiliate = await prisma.affiliate.findUnique({
                    where: {
                        referralCode: referralCode
                    }
                })
                if (affiliate) {
                  prisma.referral.create({
                    data: {
                      affiliateId: affiliate.userId,
                      referredUser: user.id,
                    }
                  })
                }
              }
        } else {
            console.log("is existing user")
            const isMatch = await bcrypt.compare(password, user.passwordHash as string);
            if (!isMatch) {
                return null
            }
        }
        console.log("done loggin in")
        return user
    }
  }), ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({token, user}) => {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session: async ({session, token}) => {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
    authorized({ auth }) {
     const isAuthenticated = !!auth?.user;
  
     return isAuthenticated;
    },
    
  },
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",

  },
})