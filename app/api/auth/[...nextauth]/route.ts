import NextAuth, {AuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// On Vercel (and other platforms behind a proxy), NextAuth's detectOrigin()
// only trusts forwarded host headers when AUTH_TRUST_HOST is set.
// Without this, NextAuth falls back to http://localhost:3000 for redirect URLs.
// Setting AUTH_TRUST_HOST=true makes NextAuth use the x-forwarded-host and
// x-forwarded-proto headers that Vercel's edge network provides, producing
// correct production URLs like https://hooshyar.sepehr.homes/admin/login
if (typeof process.env.AUTH_TRUST_HOST === 'undefined') {
  process.env.AUTH_TRUST_HOST = 'true';
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'Username', type: 'text'},
        password: {label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        console.log('[AUTH] ==================== AUTHORIZE CALLED ====================');
        console.log('[AUTH] Credentials received:', {
          username: credentials?.username,
          passwordLength: credentials?.password?.length,
          hasPassword: !!credentials?.password
        });
        
        if (!credentials?.username || !credentials?.password) {
          console.log('[AUTH] ❌ Missing credentials');
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const rawHash = process.env.ADMIN_PASSWORD_HASH_BASE64
          ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_BASE64, 'base64').toString('utf-8')
          : process.env.ADMIN_PASSWORD_HASH;

        console.log('[AUTH] Environment check:', {
          adminUsername,
          hasPasswordHashBase64: !!process.env.ADMIN_PASSWORD_HASH_BASE64,
          hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
          passwordHashLength: rawHash?.length
        });

        if (!adminUsername || !rawHash) {
          console.error('[AUTH] ❌ Admin credentials not configured in environment');
          return null;
        }

        // Check username
        console.log('[AUTH] Comparing usernames:', {
          received: credentials.username,
          expected: adminUsername,
          match: credentials.username === adminUsername
        });
        
        if (credentials.username !== adminUsername) {
          console.log('[AUTH] ❌ Username mismatch');
          return null;
        }

        // Verify password
        console.log('[AUTH] Verifying password with bcrypt...');
        const isValid = await bcrypt.compare(
          credentials.password,
          rawHash
        );

        console.log('[AUTH] Password verification result:', isValid);

        if (!isValid) {
          console.log('[AUTH] ❌ Password invalid');
          return null;
        }

        const user = {
          id: '1',
          name: adminUsername,
          email: `${adminUsername}@admin.local`
        };
        
        console.log('[AUTH] ✅ Login successful! Returning user:', user);
        console.log('[AUTH] ==================== AUTHORIZE COMPLETE ====================');
        
        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login'
  },
  debug: true,
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({session, token}) {
      if (token && session.user) {
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
