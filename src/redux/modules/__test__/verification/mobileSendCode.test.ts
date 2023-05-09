import * as assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  mobileSendCodeActions,
  mobileSendCodeActionTypes,
  mobileSendCodeReducer,
  mobileSendCodeSagas,
  watchMobileSendCode,
} from 'ranger-redux/modules/verification/mobileSendCode';
import {sendRes} from 'ranger-redux/modules/__test__/verification/mobileSendCode.mock';

describe('mobileSendCode module', () => {
  it('mobileSendCode module should be defined', () => {
    expect(mobileSendCodeReducer).toBeDefined();
    expect(mobileSendCodeActionTypes).toBeDefined();
    expect(mobileSendCodeActions).toBeDefined();
  });

  describe('mobileSendCode sagas', () => {
    it('mobileSendCodeSagas should be defined', () => {
      expect(mobileSendCodeSagas).toBeDefined();
    });

    it('should yield mobile send code watcher', () => {
      const gen = mobileSendCodeSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(mobileSendCodeActionTypes.load, watchMobileSendCode),
        'it should yield watchPhoneSendCode',
      );
    });
  });

  describe('watchPhoneSendCode', () => {
    it('watchPhoneSendCode should be defined', () => {
      expect(watchMobileSendCode).toBeDefined();
    });

    it('Send code successfully', () => {
      const {message, ...payload} = sendRes;

      const gen = watchMobileSendCode({
        payload: payload,
        type: mobileSendCodeActionTypes.load,
      });

      gen.next();

      assert.deepEqual(
        gen.next({result: sendRes, status: 200}).value,
        put(mobileSendCodeActions.loadSuccess(sendRes)),
        'dispatch mobileSendCodeActions success',
      );
    });
    it('Send Code Error', () => {
      const gen = watchMobileSendCode({
        payload: {mobile: '', mobileCountry: ''},
        type: mobileSendCodeActionTypes.load,
      });

      gen.next();
      const error = new Error('Error is here');

      assert.deepEqual(
        gen.throw(error).value,
        put(mobileSendCodeActions.loadFailure(error.message)),
        'dispatch mobileSendCodeActions failure',
      );
    });
  });
});
