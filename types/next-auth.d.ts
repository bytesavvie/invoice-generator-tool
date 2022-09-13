import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id?: string;
      venmoUsername?: string;
      paypalUsername?: string;
      zelle?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    venmoUsername?: string;
    paypalUsername?: string;
    zelle?: string;
  }
}
