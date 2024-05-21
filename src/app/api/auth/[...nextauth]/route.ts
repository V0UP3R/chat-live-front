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
        const user = {
          id: '1',
          email: 'user@email.com',
          password: '123',
          name: 'Thiago',
          role: 'admin'
        }

        const isValidEmail = user.email === credentials?.email
        const isValidPassword = user.password === credentials?.password

        if (!isValidEmail || !isValidPassword) {
          return null
        }

        return user
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