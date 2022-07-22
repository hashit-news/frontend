import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Web3Provider } from '../contexts/web3/web3.provider';
import Layout from '../components/layout';
import { AuthProvider } from '../contexts/auth/auth.provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <AuthProvider>
        <ThemeProvider defaultTheme="system">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </Web3Provider>
  );
}

export default MyApp;
