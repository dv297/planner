import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

import AppDefaultLayout from '../../../components/AppDefaultLayout';
import {
  SnackbarSeverity,
  useSnackbar,
} from '../../../components/common/Snackbar';
import PersonalInformationForm from '../../../components/PersonalInformationForm';
import SettingsService from '../../../services/SettingsService';

const Settings = () => {
  const { data, isLoading, error } = useQuery(
    ['personal-information'],
    SettingsService.getPersonalInformation,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation(
    ['personal-information'],
    SettingsService.updatePersonalInformation
  );

  const { displaySnackbar } = useSnackbar();

  if (error) {
    return <div>Error loading personal information</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <PersonalInformationForm
        initialData={{
          name: data.name,
          email: data.email,
        }}
        onSubmit={(data) => {
          mutation.mutate(data);
          displaySnackbar({
            severity: SnackbarSeverity.SUCCESS,
            message: 'Saved settings!',
          });
        }}
      />
    </>
  );
};

Settings.getLayout = function getLayout(page: ReactNode) {
  return <AppDefaultLayout>{page}</AppDefaultLayout>;
};

export default Settings;
