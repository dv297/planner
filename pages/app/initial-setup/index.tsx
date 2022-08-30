import {
  OnboardingMachineProvider,
  useOnboardingMachine,
} from '../../../src/machines/onboarding/useOnboardingMachine';
import InitialSetupPathSelectorPage from '../../../src/components/pages/onboarding/InitialSetupPathSelectorPage';

interface InitialSetupProps {}

const InitialSetup = (props: InitialSetupProps) => {
  const { machineState } = useOnboardingMachine();
  console.log(machineState);

  return (
    <div className="h-screen bg-gray-200">
      <nav className="h-16 py-2 px-9 flex flex-row items-center bg-gray-800 text-gray-200 text-lg font-bold">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-8 w-8"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
              alt="Workflow"
            />
          </div>
        </div>
      </nav>
      <div className="h-12 px-9 bg-white flex flex-row items-center shadow-sm">
        <h1 className="font-thinner text-xl text-gray-500">Account Setup</h1>
      </div>

      <main className="py-8 px-9">
        {machineState.matches('initial') && <InitialSetupPathSelectorPage />}
      </main>
    </div>
  );
};

const Wrapper = () => {
  return (
    <OnboardingMachineProvider>
      <InitialSetup />
    </OnboardingMachineProvider>
  );
};

export default Wrapper;
