import React from 'react';
import {useSettings} from 'services/settings';

import SelectLanguage from './screens/SelectLanguage';
import OnboardingSlides from './screens/OnboardingSlides';

function Onboarding() {
  const settings = useSettings();

  if (!settings.locale) {
    return <SelectLanguage />;
  }

  if (!settings.onboardingDone) {
    return <OnboardingSlides />;
  }

  return null;
}

export default Onboarding;
