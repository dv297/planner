import { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { z } from 'zod';

import FullScreenLoader from '@src/components/common/FullScreenLoader';
import { TeamSchema, TeamsListSchema } from '@src/schemas/TeamsSchema';
import { UserPreferencesSchema } from '@src/schemas/UserPreferencesSchemas';
import {
  GetWorkspacesResponseDataSchema,
  WorkspaceSchema,
} from '@src/schemas/WorkspaceSchemas';
import QueryKeys from '@src/services/QueryKeys';
import TeamsService from '@src/services/TeamsService';
import UserPreferencesService from '@src/services/UserPreferencesService';
import WorkspaceService from '@src/services/WorkspaceService';

interface AppContextProps {
  children: ReactNode;
}

interface AppContextStructure {
  teams: z.infer<typeof TeamsListSchema>;
  workspaces: z.infer<typeof GetWorkspacesResponseDataSchema>;
  userPreferences: z.infer<typeof UserPreferencesSchema>;
  selectedWorkspace: z.infer<typeof WorkspaceSchema>;
  selectedTeam: z.infer<typeof TeamSchema>;
}

const AppContext = createContext({} as AppContextStructure);

const AppContextProvider = (props: AppContextProps) => {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated: () => {
      router.replace('/');
    },
  });

  const { data: workspaces, isLoading: isLoadingWorkspaces } = useQuery(
    [QueryKeys.WORKSPACES],
    WorkspaceService.getWorkspaces,
    {
      refetchOnWindowFocus: false,
      onError: () => {
        router.replace('/');
      },
    }
  );

  const { data: userPreferences, isLoading: isLoadingUserPreferences } =
    useQuery([QueryKeys.USER_PREFERENCES], UserPreferencesService.get, {
      refetchOnWindowFocus: false,
    });

  const { data: teams, isLoading: isLoadingTeams } = useQuery(
    [QueryKeys.TEAMS],
    TeamsService.getTeamsForUser,
    {
      refetchOnWindowFocus: false,
    }
  );

  const isLoading =
    isLoadingWorkspaces || isLoadingUserPreferences || isLoadingTeams;
  const hasAllData = !!workspaces && !!userPreferences && !!teams;

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!hasAllData) {
    return null;
  }

  if (!userPreferences?.hasFinishedSetup) {
    router.replace('/app/initial-setup');
  }

  const selectedWorkspace =
    workspaces.find((entry) => entry.id === userPreferences.workspaceId) ??
    workspaces[0];

  const selectedTeam =
    teams.find((team) => team.id === userPreferences?.teamId) ?? teams[0];

  return (
    <AppContext.Provider
      value={{
        workspaces,
        teams,
        userPreferences,
        selectedWorkspace,
        selectedTeam,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export { AppContextProvider, useAppContext };
