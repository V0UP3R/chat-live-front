import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials"

const authOptions:NextAuthOptions = {
  providers: [
    CredentialProvider({
      name:"credentials",
      credentials:{
        email:{ label: "Email", type: "email"},
        password:{ label: "Password", type: "password"}
      },
      async authorize(credentials){
        
        const objData = {username:credentials?.email, password:credentials?.password} 

        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTURL_SERVER}api/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(objData)
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        
        const tokenData = await res.json();

        if (!tokenData || !tokenData.access) {
          throw new Error("Invalid token data");
        }

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_NEXTURL_SERVER}user/${credentials?.email}/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenData.access}`,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }
        let user = await userRes.json();

        if (user) {
          user.name = user.username
          return user;
        } else {
          return null;
        }


      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const customUser = user as unknown as any

      if (user) {
        return {
          ...token,
          name: customUser.name,
          role: customUser.role
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role
        }
      }
    }
  },
  pages: {
    signIn: '/',
    signOut: '/'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };