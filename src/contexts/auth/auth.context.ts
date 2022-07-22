import { createContext, useContext } from 'react';
import { AuthenticatedUser } from './auth.types';

export type AuthContextProps = {
  user?: AuthenticatedUser;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
