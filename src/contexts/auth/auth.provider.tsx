import { ReactNode, useCallback, useEffect } from 'react';
import api from '../../api/backend';
import useInterval from '../../hooks/useInterval';
import useLocalStorage from '../../hooks/useLocalStorage';
import useWindowFocus from '../../hooks/useWindowFocus';
import { AuthContext } from './auth.context';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import { JwtPayloadDto } from './auth.types';
import { useWeb3 } from '../web3/web3.provider';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { provider, requestAccount, requestChainId, signMessage, switchNetwork } = useWeb3();
  const [user, setUser] = useLocalStorage<any>('USER', undefined);
  const [token, setToken] = useLocalStorage<any>('TOKEN', undefined);
  const windowFocused = useWindowFocus();

  useEffect(() => {
    if (windowFocused) {
      refreshToken();
    }
  }, [windowFocused]);

  // check every minute to see if a
  // user's token needs to be refreshed
  useInterval(() => refreshToken(), user && token && token.refresh_token ? 60000 : null);

  const refreshToken = useCallback(() => {
    if (user && token && token.refresh_token) {
      const payload = jwt_decode<JwtPayloadDto>(token.access_token);
      const expires_unix = payload.exp ?? 0;

      if (expires_unix > 0) {
        const expiry = moment.unix(expires_unix);
        const now = moment.utc();
        if (now.isAfter(expiry)) {
          getRefreshToken(token.refresh_token)
            .then(newToken => {
              setToken(newToken);
            })
            .catch(() => {
              signOut();
            });
        }
      }
    }
  }, [user, token]);

  useEffect(() => {
    if (provider) {
      const doSignOut = async () => await signOut();
      provider.on('accountsChanged', _accounts => {
        doSignOut();
      });

      provider.on('chainChanged', _accounts => {
        doSignOut();
      });
    }

    return () => {
      provider?.removeAllListeners();
    };
  }, [provider]);

  const signIn = async () => {
    if (provider) {
      const chainId = await requestChainId();

      if (chainId !== process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID) {
        await switchNetwork(parseInt(process.env.NEXT_PUBLIC_ETH_ALLOWED_CHAIN_ID || '0x3'));
      }

      const address = await requestAccount();

      if (address) {
        const loginInfo = await getLoginInfo(address);
        const signedMessage = await signMessage(loginInfo.signature, loginInfo.walletAddress);

        if (signedMessage) {
          const token = await getAccessToken(address, signedMessage);

          if (token) {
            const payload = jwt_decode<JwtPayloadDto>(token.access_token);

            setToken(token);
            setUser({
              id: payload.sub,
              username: payload.name,
              walletAddress: address,
              chainId,
            });
          }
        }
      }
    }
  };

  const signOut = async () => {
    setUser(undefined);
    setToken(undefined);
  };

  const getLoginInfo = async (walletAddress: string) => {
    return await api.auth.getLoginInfo({ walletAddress });
  };

  const getAccessToken = async (walletAddress: string, signedMessage: string) => {
    try {
      return await api.auth.getToken({
        requestBody: {
          walletAddress,
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
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
