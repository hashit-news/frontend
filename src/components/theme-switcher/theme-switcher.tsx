import { useTheme } from 'next-themes';
import { FunctionComponent, useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';

export const ThemeSwitcher: FunctionComponent = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button className="btn btn-ghost" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <div className="w-5">{isDark ? <MoonIcon /> : <SunIcon />}</div>
    </button>
  );
};
