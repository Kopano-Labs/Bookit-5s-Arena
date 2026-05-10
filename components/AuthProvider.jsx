'use client';

import { SessionProvider } from 'next-auth/react';

/** Session only — root `app/layout.jsx` already wraps the tree with `ThemeProvider`. */
const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
