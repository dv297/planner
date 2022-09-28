import { Menu } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import QueryKeys from '../services/QueryKeys';
import SettingsService from '../services/SettingsService';
import UserAvatar from './common/UserAvatar';
import ProfileApplicationMenu from './ProfileApplicationMenu';

const ProfileIconButton = () => {
  const { data } = useQuery(
    [QueryKeys.PERSONAL_INFORMATION],
    SettingsService.getPersonalInformation,
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(data);

  if (!data) {
    return null;
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span className="sr-only">Open user menu</span>
        <UserAvatar user={data} />
      </Menu.Button>
      <ProfileApplicationMenu />
    </Menu>
  );
};

export default ProfileIconButton;
