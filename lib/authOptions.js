import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Auto-generate a @handle from a display name: "John Doe" → "john_doe"
const makeUsername = (name = '') =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30) || 'player';

export const authOptions = {
  providers: [
    // ── Google OAuth2 ──────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ── Facebook OAuth — only active when credentials are configured ──
    // To enable: add FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET to .env.local
    // Then set NEXT_PUBLIC_FACEBOOK_ENABLED=true in .env.local
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),

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

        // Ensure email and password are strings to prevent NoSQL injection
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          throw new Error('Invalid credentials format');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

        if (!user || !user.password) {
          throw new Error('No account found with this email');
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
          image: user.profileImage || user.image,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // Add id, role and username to the JWT token
    async jwt({ token, user, account, trigger, session: updateSession }) {
      // Handle session.update() calls from the client (e.g. after profile save)
      if (trigger === 'update' && updateSession) {
        if (updateSession.name !== undefined) token.name = updateSession.name;
        if (updateSession.username !== undefined) token.username = updateSession.username;
        if (updateSession.image !== undefined) token.picture = updateSession.image;
        return token;
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        if (user.image) token.picture = user.image;
      }

      // Handle social sign-in: upsert user in DB
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        await connectDB();
        let dbUser = await User.findOne({ email: token.email });

        if (!dbUser) {
          // New social user — auto-generate username from their name
          dbUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
            username: makeUsername(token.name),
          });
        } else if (!dbUser.username) {
          // Back-fill username for existing users who don't have one yet
          dbUser.username = makeUsername(dbUser.name);
          await dbUser.save();
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.username = dbUser.username;
        // Prefer user's uploaded avatar over the OAuth picture
        if (dbUser.profileImage) token.picture = dbUser.profileImage;
      }

      return token;
    },

    // Expose id, role, username and image on the session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        if (token.picture) session.user.image = token.picture;
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
