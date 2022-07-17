import Web3 from 'web3';

export type Web3ContextProps = {
  user?: Web3User;
  web3?: Web3;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export type Web3User = {
  id: string;
  username?: string | null;
  walletAddress: string;
  chainId: string;
};

export interface JwtPayloadDto {
  sub: string;
  name?: string | null;
}
