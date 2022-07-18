import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { Fragment, FunctionComponent } from 'react';
import { useWeb3 } from '../../contexts/web3/web3.provider';

export const ProfileMenu: FunctionComponent = () => {
  const { user, signIn, signOut } = useWeb3();

  return (
    <>
      {!user && (
        <button className="btn btn-primary" onClick={() => signIn()}>
          Connect
        </button>
      )}
      {user && (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost avatar">
            <div className="w-10 rounded-full">
              <UserCircleIcon />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
            <li>
              <a onClick={() => signOut()}>Logout</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
