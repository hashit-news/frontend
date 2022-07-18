// import Image from 'next/image';
import { FunctionComponent } from 'react';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export type HeaderProps = {};

export const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <h1 className="text-xl cursor-default ml-2"># hash it</h1>
      </div>
      <div className="flex-none gap-2">
        <ThemeSwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
};
