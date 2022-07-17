import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { JwtPayloadDto, Web3ContextProps, Web3User } from './web3.types';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { BaseProvider } from '@metamask/providers';
import api from '../../api/backend';
import jwt_decode from 'jwt-decode';
import useLocalStorage from '../../hooks/useLocalStorage';
import useInterval from '../../hooks/useInterval';
import moment from 'moment';
import { AccessTokenResponse } from '../../api/backend/swagger';

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
  const [token, setToken] = useLocalStorage<AccessTokenResponse | undefined>('TOKEN', undefined);
  const [web3, setWeb3] = useState<Web3>();
  const [provider, setProvider] = useState<BaseProvider>();

  useEffect(() => {
    if (provider) {
      provider.on('accountsChanged', _accounts => {
        signOut();
      });

      provider.on('chainChanged', (chainId: string) => {
        if (user) {
          setUser({
            ...user,
            chainId,
          });
        }
      });
    }

    return () => {
      provider?.removeAllListeners();
    };
  }, [provider]);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  // check every minute to see if a
  // user's token needs to be refreshed
  useInterval(
    () => {
      if (user && token && token.refresh_token) {
        const payload = jwt_decode<JwtPayloadDto>(token.access_token);
        const expires_unix = payload.exp ?? 0;

        if (expires_unix > 0) {
          const expiry = moment.unix(expires_unix);
          const now = moment.utc();
          if (now.isAfter(expiry)) {
            getRefreshToken(token.refresh_token).then(newToken => {
              setToken(newToken);
            });
          }
        }
      }
    },
    user && token && token.refresh_token ? 60000 : null
  );

  if (!mounted) {
    return null;
  }

  const signIn = async () => {
    const provider = (await detectEthereumProvider()) as BaseProvider;

    if (provider) {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = (await provider.request({ method: 'eth_chainId' })) as string;

      if (chainId !== process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID }],
        });
      }

      const address = accounts[0];
      const loginInfo = await getLoginInfo(address);
      const web3 = new Web3(provider as unknown as provider);

      const signedMessage = await web3.eth.personal.sign(loginInfo.signature, loginInfo.publicAddress, '');
      const token = await getAccessToken(address, signedMessage);

      if (token) {
        const payload = jwt_decode<JwtPayloadDto>(token.access_token);

        setToken(token);
        setWeb3(web3);
        setProvider(provider);
        setUser({
          id: payload.sub,
          username: payload.name,
          walletAddress: address,
          chainId,
        });
      }
    }
  };

  const signOut = async () => {
    setUser(undefined);
    setToken(undefined);
  };

  const getLoginInfo = async (publicAddress: string) => {
    return await api.auth.getLoginInfo({ publicAddress });
  };

  const getAccessToken = async (publicAddress: string, signedMessage: string) => {
    try {
      return await api.auth.getToken({
        requestBody: {
          publicAddress,
          signedMessage,
        },
      });
    } catch (err) {
      signOut();
    }

    return;
  };

  const getRefreshToken = async (refreshToken: string) => {
    try {
      return await api.auth.getRefreshToken({
        requestBody: {
          refreshToken,
        },
      });
    } catch (err) {
      signOut();
    }

    return;
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
