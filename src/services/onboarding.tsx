import React, { memo, useCallback, useContext, useMemo, useState } from "react";

const OnboardingContext = React.createContext({
  finishedOnboarding: false,
  markOnboardingAsDone() {},
});

interface Props {
  children: React.ReactNode;
}

function OnboardingProvider({ children }: Props) {
  const [onboarding, setOnboarding] = useState(false);

  const markOnboardingAsDone = useCallback(() => {
    setOnboarding(true);
  }, []);

  const value = useMemo(
    () => ({
      finishedOnboarding: onboarding,
      markOnboardingAsDone,
    }),
    [onboarding]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export default memo(OnboardingProvider);

export const useOnboarding = () => useContext(OnboardingContext);
