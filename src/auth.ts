


import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import pool from "./lib/db/db";
import { CustomAdapter } from "./lib/auth/custom-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter:CustomAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
        async signIn({ user }) {
                try {
                  console.log("user -- ", user);
                 const {rows} = await pool.query(
                    "SELECT * FROM auth_table WHERE email = $1 AND archived_at IS NULL",
                    [user.email]
                  );
                  if(rows.length ===0  ) { return false}
                  return true;
                } catch (error) {
                  console.error("SignIn error:", error);
                  return false;
                }
        },
         async redirect({ baseUrl }) {
                return `${baseUrl}/dashboard`;
         },
      },
  
  secret: process.env.NEXTAUTH_SECRET,
  
});




