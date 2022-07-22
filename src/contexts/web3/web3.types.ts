import { BaseProvider } from '@metamask/providers';

export type Web3ContextProps = {
  provider?: BaseProvider;
  requestChainId: () => Promise<number | undefined>;
  requestAccount: () => Promise<string | undefined>;
  switchNetwork: (chainId: number) => Promise<void>;
  signMessage: (signature: string, walletAddress: string) => Promise<string | undefined>;
};
