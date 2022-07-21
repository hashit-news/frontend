export type AuthenticatedUser = {
  id: string;
  username?: string | null;
  walletAddress: string;
  chainId: number;
};

export type JwtPayloadDto = {
  sub: string;
  name?: string | null;
  iat?: number;
  exp?: number;
};

export type AuthContextProps = {
  user?: AuthenticatedUser;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};
