import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { WalletUser, Web3ContextProps } from './web3.types';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { BaseProvider } from '@metamask/providers';
import { env } from '../../config';

const Web3Context = createContext<Web3ContextProps>({
  isConnected: false,
  connect: async () => undefined,
  disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

type Props = {
  children: ReactNode;
};

export const Web3Provider = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [web3, setWeb3] = useState<Web3>();
  const [provider, setProvider] = useState<BaseProvider>();
  const [currentAccount, setcurrentAccount] = useState<string>();
  const [currentChainId, setCurrentChainId] = useState<number>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true })
      .then(provider => {
        const web3 = new Web3(provider as unknown as provider);
        setWeb3(web3);
        setProvider(provider as BaseProvider);
        setIsConnected(true);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', (accounts: string[]) => handleAccountChanged(accounts));
      provider.on('chainChanged', (chainId: string) => handleChainIdChanged(chainId));
    }

    return () => {
      provider?.removeAllListeners();
    };
  }, [provider]);

  const connect = async (): Promise<WalletUser | undefined> => {
    console.log('connecting', provider);
    if (provider) {
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
      await handleChainIdChanged(chainId);
      const accounts = await provider.request({ method: 'eth_accounts' });
      await handleAccountChanged(accounts as string[]);
      console.log('finished', currentAccount, currentChainId);
      if (currentAccount && currentChainId) {
        return {
          walletAddress: currentAccount,
          chainId: currentChainId,
        };
      }
    }

    return;
  };

  const disconnect = () => {
    setWeb3(undefined);
    setProvider(undefined);
    setcurrentAccount(undefined);
    setCurrentChainId(undefined);
  };

  const parseChainId = (chainId: string) => {
    const parsedChainId = parseInt(chainId?.replace('0x', ''), 10);
    if (Number.isNaN(parsedChainId)) {
      return 0;
    }
    return parsedChainId;
  };

  const handleChainIdChanged = async (chainId: string) => {
    try {
      const parsedChainId = parseChainId(chainId);
      if (parsedChainId !== env.ethAllowedChainId) {
        if (!provider) {
          throw new Error('No provider');
        }

        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${env.ethAllowedChainId}` }],
        });
      }

      setCurrentChainId(parsedChainId);
    } catch (err) {
      console.error(err);
      disconnect();
    }
  };

  const handleAccountChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (!currentAccount) {
      console.log('here');
      setcurrentAccount(accounts[0]);
      // Do any other work!
    } else {
      console.log('dc');
      disconnect();
    }
  };

  // // useEffect(() => setMounted(true), []);

  // const connectProvider = async () => {
  //   Web3.providers.WebsocketProvider;
  //   try {
  //     const provider = await detectEthereumProvider({ mustBeMetaMask: true });
  //     setProvider(provider as BaseProvider);
  //     setWeb3(new Web3(provider as unknown as provider));
  //     console.log('connected to provider', provider);
  //   } catch (err) {
  //     console.error(err);
  //     setProvider(undefined);
  //     setWeb3(undefined);
  //   }
  // };

  // const requestCurrentAccount = async () => {
  //   if (!provider) {
  //     await connectProvider();
  //   }

  //   if (provider) {
  //     const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
  //     setCurrentWalletAddress(accounts[0]);
  //     return accounts[0];
  //   }

  //   return;
  // };

  // const requestCurrentChainId = async () => {
  //   if (!provider) {
  //     await connectProvider();
  //   }

  //   if (provider) {
  //     const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
  //     setCurrentChainId(chainId);
  //     return chainId;
  //   }

  //   return;
  // };

  // const resetCurrentAccount = () => {
  //   setCurrentWalletAddress(undefined);
  //   setCurrentChainId(undefined);
  // };

  // useEffect(() => {
  //   if (provider) {
  //     console.log('listening for provider changes');
  //     provider.on('accountsChanged', (accounts: string[]) => {
  //       resetCurrentAccount();
  //     });

  //     provider.on('chainChanged', (chainId: string) => {
  //       resetCurrentAccount();
  //     });
  //   }

  //   return () => {
  //     provider?.removeAllListeners();
  //   };
  // }, [provider]);

  useEffect(() => setMounted(true), []);

  // When mounted on client, now we can show the UI
  if (!mounted) {
    return null;
  }

  return (
    <Web3Context.Provider
      value={{
        currentAccount,
        currentChainId,
        isConnected,
        web3,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
