import Web3 from 'web3';

export type Web3ContextProps = {
  currentAccount?: string;
  currentChainId?: number;
  isConnected: boolean;
  web3?: Web3;
  connect: () => Promise<WalletUser | undefined>;
  disconnect: () => void;
};

export type WalletUser = {
  walletAddress: string;
  chainId: number;
};
