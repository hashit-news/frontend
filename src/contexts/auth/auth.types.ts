export type AuthContextProps = {
  user?: AuthUser;
  chainId?: number;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthUser = {
  id: string;
  username?: string;
  walletAddress: string;
  roles: string[];
};
