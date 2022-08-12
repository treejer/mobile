import {changeUseGGN, markOnBoardingDone, resetOnBoardingData, updateLocale} from 'redux/modules/settings/settings';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export const useSettings = () => {
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();

  const handleMarkOnBoardingDone = () => {
    dispatch(markOnBoardingDone());
  };

  const handleResetOnBoarding = () => {
    dispatch(resetOnBoardingData());
  };

  const handleChangeLocale = (newLocale: string) => {
    dispatch(updateLocale(newLocale));
  };

  const handleChangeUseGGN = (useGGN: boolean) => {
    dispatch(changeUseGGN(useGGN));
  };

  return {
    ...settings,
    updateLocale: handleChangeLocale,
    markOnBoardingDone: handleMarkOnBoardingDone,
    changeUseGGN: handleChangeUseGGN,
    resetOnBoardingData: handleResetOnBoarding,
  };
};
