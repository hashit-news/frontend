import { Link } from '@imtbl/imx-sdk';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { AuthContextProps, AuthUser } from './auth.types';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { provider } from 'web3-core';
import axios from 'axios';
import { BaseProvider } from '@metamask/providers';

const AuthContext = createContext<AuthContextProps>({
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const link = new Link('https://link.ropsten.x.immutable.com');
  const [walletAddress, setWalletAddress] = useLocalStorage<string>('walletAddress', '');
  const [user, setUser] = useState<AuthUser>();
  const [web3, setWeb3] = useState<Web3>();
  const [provider, setProvider] = useState<BaseProvider>();
  const [chainId, setChainId] = useState<string>();

  const signIn = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const { address } = await link.setup({});
      const loginInfo = await getLoginInfo(address);
      const web3 = new Web3(provider as unknown as provider);
      const signedMessage = await web3.eth.personal.sign(loginInfo.signature, loginInfo.publicAddress, '');
      const token = await getAccessToken(address, signedMessage);
      console.log(token);

      setWalletAddress(address);
      setWeb3(web3);
      setProvider(provider as BaseProvider);
      const chainId = (provider as BaseProvider)?.chainId;
      if (chainId) {
        setChainId(chainId);
      }
    }
  };

  const signOut = async () => {
    setWalletAddress('');
  };

  const getLoginInfo = async (publicAddress: string) => {
    const res = await axios.get<{ publicAddress: string; signature: string }>(
      `http://localhost:8080/auth/web3?publicAddress=${publicAddress}`
    );

    return res.data;
  };

  const getAccessToken = async (publicAddress: string, signedMessage: string) => {
    const res = await axios.post<{
      access_token: string;
      token_type: 'Bearer';
      expires_in: number;
      refresh_token?: string;
      scope?: string;
    }>('http://localhost:8080/auth/token', {
      publicAddress,
      signedMessage,
    });

    return res.data;
  };

  useEffect(() => {
    if (walletAddress) {
      setUser({
        id: walletAddress,
        username: walletAddress,
        walletAddress: walletAddress,
        roles: ['user'],
      });
    } else {
      web3?.eth.accounts.wallet.clear();
      setUser(undefined);
    }
  }, [walletAddress, web3?.eth.accounts.wallet]);

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', accounts => {
        console.log('accountsChanged', accounts);
        setWalletAddress('');
      });

      provider.on('chainChanged', (chainId: string) => {
        console.log('chainChanged', chainId);
        setChainId(chainId);
      });
    }

    return () => {
      provider?.removeAllListeners();
    };
  }, [provider]);

  return (
    <AuthContext.Provider
      value={{
        user,
        chainId,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
