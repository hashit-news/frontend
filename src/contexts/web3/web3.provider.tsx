import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Web3ContextProps } from './web3.types';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { BaseProvider } from '@metamask/providers';
import useWindowFocus from '../../hooks/useWindowFocus';

const Web3Context = createContext<Web3ContextProps>({
  requestChainId: async () => undefined,
  requestAccount: async () => undefined,
  switchNetwork: async () => {},
  signMessage: async () => undefined,
});

export const useWeb3 = () => useContext(Web3Context);

type Props = {
  children: ReactNode;
};

export const Web3Provider = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [provider, setProvider] = useState<BaseProvider>();
  const windowFocused = useWindowFocus();

  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setProvider(provider as BaseProvider);
      }
    })();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!provider) {
      (async () => {
        const provider = await detectEthereumProvider();

        if (provider) {
          setProvider(provider as BaseProvider);
        }
      })();
    }
  }, [windowFocused, provider]);

  if (!mounted) {
    return null;
  }

  const requestChainId = async () => {
    if (provider) {
      const chainId = await provider.request({ method: 'eth_chainId' });
      return parseInt(chainId as string);
    }

    return;
  };

  const requestAccount = async () => {
    if (provider) {
      const account = (await provider.request({ method: 'eth_accounts' })) as string[];
      return account[0];
    }

    return;
  };

  const switchNetwork = async (chainId: number) => {
    if (provider) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      });
    }
  };

  const signMessage = async (signature: string, walletAddress: string) => {
    if (provider) {
      const web3 = new Web3(provider as unknown as provider);
      const signedMessage = await web3.eth.personal.sign(signature, walletAddress, '');

      return signedMessage;
    }

    return;
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        requestAccount,
        requestChainId,
        switchNetwork,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
