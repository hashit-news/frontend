import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { JwtPayloadDto, Web3ContextProps, Web3User } from './web3.types';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { BaseProvider } from '@metamask/providers';
import api from '../../api/backend';
import jwt_decode from 'jwt-decode';
import useLocalStorage from '../../hooks/useLocalStorage';

const AuthContext = createContext<Web3ContextProps>({
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
};

export const Web3Provider = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useLocalStorage<Web3User | undefined>('USER', undefined);
  const [web3, setWeb3] = useState<Web3>();
  const [provider, setProvider] = useState<BaseProvider>();

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', accounts => {
        console.log('accountsChanged', accounts);
        setUser(undefined);
      });

      provider.on('chainChanged', (chainId: string) => {
        console.log('chainChanged', chainId);
      });
    }

    return () => {
      provider?.removeAllListeners();
    };
  }, [provider, setUser]);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const signIn = async () => {
    const provider = (await detectEthereumProvider()) as BaseProvider;

    if (provider) {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;

      if (chainId !== process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID) {
        const res = await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID }],
        });

        console.log(res);
      }

      const address = accounts[0];
      const loginInfo = await getLoginInfo(address);
      const web3 = new Web3(provider as unknown as provider);

      const signedMessage = await web3.eth.personal.sign(loginInfo.signature, loginInfo.publicAddress, '');
      const token = await getAccessToken(address, signedMessage);
      const user = jwt_decode<JwtPayloadDto>(token.access_token);
      setWeb3(web3);
      setProvider(provider);
      setUser({
        id: user.sub,
        username: user.name,
        walletAddress: address,
        chainId,
      });
    }
  };

  const signOut = async () => {
    setUser(undefined);
  };

  const getLoginInfo = async (publicAddress: string) => {
    return await api.auth.getLoginInfo({ publicAddress });
  };

  const getAccessToken = async (publicAddress: string, signedMessage: string) => {
    return api.auth.getToken({
      requestBody: {
        publicAddress,
        signedMessage,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        web3,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
