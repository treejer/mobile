import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  mobileResendCodeActions,
  mobileResendCodeActionTypes,
  mobileResendCodeReducer,
  mobileResendCodeSagas,
  watchMobileResendCode,
} from 'ranger-redux/modules/verification/mobileResendCode';

describe('mobileResendCode module', () => {
  it('mobileResendCode module should be defined', () => {
    expect(mobileResendCodeReducer).toBeDefined();
    expect(mobileResendCodeActions).toBeDefined();
    expect(mobileResendCodeActionTypes).toBeDefined();
  });

  describe('mobileResendCode sagas', () => {
    it('mobileResendCodeSagas should be defined', () => {
      expect(mobileResendCodeSagas()).toBeDefined();
    });

    it('should yield mobile send code watcher', () => {
      const gen = mobileResendCodeSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(mobileResendCodeActionTypes.load, watchMobileResendCode),
        'it should yield watchMobileResendCode',
      );
    });
  });

  describe('watchMobileResendCode', () => {
    it('watchMobileResendCode should be defined', () => {
      expect(watchMobileResendCode).toBeDefined();
    });

    it('Resend code successfully', () => {
      const gen = watchMobileResendCode();

      gen.next();

      assert.deepEqual(
        gen.next({
          result: 'message',
          status: 200,
        }).value,
        put(mobileResendCodeActions.loadSuccess('message')),
        'dispatch mobileResendCodeActions success',
      );
    });
    it('Resend Code Error', () => {
      const gen = watchMobileResendCode();

      gen.next();
      const error = new Error('Error is here');

      assert.deepEqual(
        gen.throw(error).value,
        put(mobileResendCodeActions.loadFailure(error.message)),
        'dispatch mobileResendCodeActions failure',
      );
    });
  });
});
