import type { NextPage } from 'next';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold underline">The current theme is: {theme}</h1>
      <button className="btn btn-primary" onClick={() => setTheme('light')}>
        <span>
          <SunIcon className="w-5 h-5" />
        </span>
        Light
      </button>
      <button className="btn btn-secondary" onClick={() => setTheme('dark')}>
        <span>
          <MoonIcon className="w-5 h-5" />
        </span>
        Dark
      </button>
      <button className="btn btn-accent" onClick={() => setTheme('system')}>
        System
      </button>
    </div>
  );
};
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ThemeChanger />
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
