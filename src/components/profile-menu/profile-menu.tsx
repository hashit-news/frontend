import { UserCircleIcon } from '@heroicons/react/solid';
import { FunctionComponent } from 'react';
import { Menu } from '@headlessui/react';
import { useAuth } from '../../contexts/auth/auth.context';

export const ProfileMenu: FunctionComponent = () => {
  const { user, signIn, signOut } = useAuth();

  return (
    <>
      {!user && (
        <button className="btn btn-primary" onClick={() => signIn()}>
          Connect
        </button>
      )}
      {user && (
        <Menu as="div" className="dropdown dropdown-end">
          <Menu.Button>
            <label tabIndex={0} className="btn btn-ghost avatar">
              <div className="w-10 rounded-full">
                <UserCircleIcon />
              </div>
            </label>
          </Menu.Button>
          <Menu.Items
            as="ul"
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
          >
            <Menu.Item as="li">
              <a onClick={() => signOut()}>Logout</a>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      )}
    </>
  );
};
