import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

