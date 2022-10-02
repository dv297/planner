import { useRouter } from 'next/router';

import Button from '@src/components/common/Button';
import OnboardingService from '@src/services/OnboardingService';
import extractSingle from '@src/utils/extractSingle';

const InitialSetupSuccess = () => {
  const router = useRouter();

  return (
    <>
      <p className="text-lg text-slate-800 mt-8">You are all set up!</p>
      <p className="text-lg text-slate-800 mt-8">
        Click below to be taken to the main application.
        {router.query.inviteToken}
      </p>
      <div className="mt-8">
        <Button
          onClick={async () => {
            Promise.resolve(async () => {
              const inviteToken = extractSingle(router.query.inviteToken);

              if (inviteToken) {
                await OnboardingService.acceptTeamInvite(inviteToken);
              }
            }).finally(() => {
              router.replace('/app/dashboard');
            });
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default InitialSetupSuccess;
