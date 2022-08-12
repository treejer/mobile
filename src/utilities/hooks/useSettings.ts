import {
  changeUseGSN,
  markOnBoardingDone,
  resetOnBoardingData,
  updateLocale,
} from '../../redux/modules/settings/settings';
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

  const handleChangeUseGSN = (useGSN: boolean) => {
    dispatch(changeUseGSN(useGSN));
  };

  return {
    ...settings,
    updateLocale: handleChangeLocale,
    markOnBoardingDone: handleMarkOnBoardingDone,
    changeUseGSN: handleChangeUseGSN,
    resetOnBoardingData: handleResetOnBoarding,
  };
};
