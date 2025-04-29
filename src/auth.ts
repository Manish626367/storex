
//-------------------------------------------------
//------   ---------


// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { v4 as uuidv4 } from "uuid";
// import pool from "@/lib/db/db";

// declare module "next-auth" {
//   interface Session {
//     authUserId?: string;
//     sessionToken?: string;
//   }

//   interface User {
//     authUserId?: string;
//     sessionToken?: string;
//   }

// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       try {
//         console.log("user -- ", user);

//         const { rows } = await pool.query(
//           "SELECT * FROM auth_table WHERE email = $1 AND archived_at IS NULL",
//           [user.email]
//         );

//         if (rows.length === 0) {
//           console.log("User not found");
//           return false;
//         }

//         const authUserId = rows[0].auth_user_id;
      

//         await pool.query(
//           `INSERT INTO session_table (
//             session_id, 
//             auth_user_id, 
//             start_time, 
//             end_time, 
//             session_token
//           ) VALUES ($1, $2, NOW(), NOW() + INTERVAL '1 month', $3)`,
//           [uuidv4(), authUserId, null]
//         );

//         user.authUserId = authUserId;
        

//         return true;
//       } catch (error) {
//         console.error("SignIn error:", error);
//         return false;
//       }
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.authUserId = user.authUserId;
     
//       }
//       console.log("------>>>>>>>>>>>>>>>>",token)
//       return token;
//     },

//     async session({ session, token }) {
//       try {
//         console.log("token -- ", token);
//         console.log("session -- ", session);

//         if (token) {
//           session.authUserId = token.authUserId as string ;
         
//         }

//         return session;
//       } catch (error) {
//         console.error("Session error:", error);
//         return session;
//       }
//     },

//     async redirect({ baseUrl }) {
//       return `${baseUrl}/dashboard`;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login",
//     signOut: "/login",
//   },
// });


//-------------------------------------------------------------------------------------------------------------------------

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { CustomAdapter } from "@/lib/auth/custom-adapter";
// import pool from "@/lib/db/db";


// declare module "next-auth" {
//     interface Session {
//       authUserId?: string;
//     }
  
//   }

// export const { handlers, auth } = NextAuth({
//   adapter: CustomAdapter(pool),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.authUserId = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.authUserId) {
//         session.authUserId = token.authUserId as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login",
//     signOut: "/login",
//   },
// });


//---------- predifine adapters -------------



// import GoogleProvider from "next-auth/providers/google";
// import NextAuth from "next-auth"
// import PostgresAdapter from "@auth/pg-adapter"
// import pool from "./lib/db/db";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PostgresAdapter(pool),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//             try {
//               console.log("user -- ", user);
//               await pool.query(
//                 "SELECT * FROM auth_table WHERE email = $1 AND archived_at IS NULL",
//                 [user.email]
//               );

//               return true;
//             } catch (error) {
//               console.error("SignIn error:", error);
//               return false;
//             }
//     },
//      async redirect({ baseUrl }) {
//             return `${baseUrl}/dashboard`;
//      },
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });




//------------------------------------------------------




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




