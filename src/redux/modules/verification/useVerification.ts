import {useCallback} from 'react';

import {TMobileSendCodePayload} from 'webServices/verification/mobileSendCode';
import {TVerifyMobilePayload} from 'webServices/verification/verifyMobile';
import {TVerifyProfilePayload} from 'webServices/verification/verifyProfile';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {mobileResendCodeActions} from 'ranger-redux/modules/verification/mobileResendCode';
import {mobileSendCodeActions} from 'ranger-redux/modules/verification/mobileSendCode';
import {verifyMobileActions} from 'ranger-redux/modules/verification/verifyMoblie';
import {verifyProfileActions} from 'ranger-redux/modules/verification/verifyProfile';

export function useVerification() {
  const {data: mobileSendCode, ...mobileSendCodeState} = useAppSelector(state => state.mobileSendCode);
  const {data: mobileResendCode, ...mobileResendCodeState} = useAppSelector(state => state.mobileResendCode);
  const {data: verifyMobile, ...verifyMobileState} = useAppSelector(state => state.verifyMobile);
  const {data: verifyProfile, ...verifyProfileState} = useAppSelector(state => state.verifyProfile);

  const dispatch = useAppDispatch();

  const dispatchPhoneSendCode = useCallback(
    (payload: TMobileSendCodePayload) => {
      dispatch(mobileSendCodeActions.load(payload));
    },
    [dispatch],
  );

  const dispatchPhoneResendCode = useCallback(() => {
    dispatch(mobileResendCodeActions.load());
  }, [dispatch]);

  const dispatchVerifyMobile = useCallback(
    (payload: TVerifyMobilePayload) => {
      dispatch(verifyMobileActions.load(payload));
    },
    [dispatch],
  );

  const dispatchVerifyProfile = useCallback(
    (payload: TVerifyProfilePayload) => {
      dispatch(verifyProfileActions.load(payload));
    },
    [dispatch],
  );

  const dispatchResetVerification = useCallback(() => {
    dispatch(mobileSendCodeActions.resetCache());
    dispatch(mobileResendCodeActions.resetCache());
    dispatch(verifyMobileActions.resetCache());
    dispatch(verifyProfileActions.resetCache());
  }, [dispatch]);

  return {
    mobileSendCode,
    mobileSendCodeState,
    dispatchPhoneSendCode,
    mobileResendCode,
    mobileResendCodeState,
    dispatchPhoneResendCode,
    verifyMobile,
    verifyMobileState,
    dispatchVerifyMobile,
    verifyProfile,
    verifyProfileState,
    dispatchVerifyProfile,
    dispatchResetVerification,
  };
}
