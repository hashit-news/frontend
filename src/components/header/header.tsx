// import Image from 'next/image';
import { FunctionComponent } from 'react';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { HeaderProps } from './header.types';
import { UserCircleIcon } from '@heroicons/react/solid';

export const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">hashit.news</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered" />
        </div>
        <ThemeSwitcher />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost avatar">
            <div className="w-10 rounded-full">
              <UserCircleIcon />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
