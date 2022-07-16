export type AuthContextProps = {
  user?: AuthUser;
  chainId?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthUser = {
  id: string;
  username?: string;
  walletAddress: string;
  roles: string[];
};
