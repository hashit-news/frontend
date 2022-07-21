import moment from 'moment';
import { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import api from '../../api/backend';
import { AccessTokenResponse } from '../../api/backend/swagger';
import useInterval from '../../hooks/useInterval';
import useLocalStorage from '../../hooks/useLocalStorage';
import useWindowFocus from '../../hooks/useWindowFocus';
import { AuthContextProps, AuthenticatedUser, JwtPayloadDto } from './auth.types';
import jwt_decode from 'jwt-decode';
import { useWeb3 } from '../web3/web3.provider';

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({
  signIn: async () => {},
  signOut: async () => {},
});

export const useSession = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useLocalStorage<AuthenticatedUser | undefined>('USER', undefined);
  const [token, setToken] = useLocalStorage<AccessTokenResponse | undefined>('TOKEN', undefined);
  const { currentAccount, currentChainId, connect, disconnect, isConnected, web3 } = useWeb3();
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

  const signIn = async () => {
    if (isConnected) {
      const walletUser = await connect();
      console.log(walletUser);

      if (walletUser && web3) {
        const { walletAddress, chainId } = walletUser;
        const loginInfo = await getLoginInfo(walletAddress);
        const signedMessage = await web3.eth.personal.sign(loginInfo.signature, loginInfo.walletAddress, '');
        const token = await getAccessToken(walletAddress, signedMessage);

        if (token) {
          const payload = jwt_decode<JwtPayloadDto>(token.access_token);

          setToken(token);
          setUser({
            id: payload.sub,
            username: payload.name,
            walletAddress,
            chainId,
          });
        }
      }
    }
  };

  const signOut = async () => {
    setUser(undefined);
    setToken(undefined);
    disconnect();
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
