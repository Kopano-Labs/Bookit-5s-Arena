import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    // ── Google OAuth2 ──────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ── Email + Password ───────────────────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error('No account found with this email');
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // Add user id and role to the JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Handle Google sign-in: create user in DB if they don't exist
      if (account?.provider === 'google') {
        await connectDB();
        let dbUser = await User.findOne({ email: token.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
          });
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }

      return token;
    },

    // Expose id and role on the session object (accessible in components)
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
