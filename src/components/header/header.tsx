// import Image from 'next/image';
import { FunctionComponent } from 'react';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { HeaderProps } from './header.types';

export const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">hashit.news</a>
      </div>
      <div className="flex-none gap-2">
        <ThemeSwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
};
