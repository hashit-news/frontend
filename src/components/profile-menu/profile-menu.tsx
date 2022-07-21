import { UserCircleIcon } from '@heroicons/react/solid';
import { FunctionComponent } from 'react';
import { useSession } from '../../contexts/auth/auth.provider';

export const ProfileMenu: FunctionComponent = () => {
  const { user, signIn, signOut } = useSession();

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
