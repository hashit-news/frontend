// import Image from 'next/image';
import { FunctionComponent } from 'react';
import { useModal } from '../../contexts/modal/modal.context';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export type HeaderProps = {};

export const Header: FunctionComponent<HeaderProps> = () => {
  const { open1, open2 } = useModal();

  return (
    <header className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <h1 className="text-xl cursor-default ml-2"># hash it</h1>
      </div>
      <div className="flex-none gap-2">
        <button
          onClick={() => {
            open1({
              title: 'Theme Switcher',
              children: (
                <div className="space-x-4">
                  <button
                    className="bg-gray-200 px-2 py-1 rounded"
                    onClick={() =>
                      open2({
                        title: 'Another Modal',
                        children: 'Another modal',
                      })
                    }
                  >
                    Open another
                  </button>
                </div>
              ),
            });
          }}
          className="btn btn-sm btn-primary"
        >
          Test open modal
        </button>
        <ThemeSwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
};
