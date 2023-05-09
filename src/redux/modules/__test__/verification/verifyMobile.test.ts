import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  verifyMobileActions,
  verifyMobileActionTypes,
  verifyMobileReducer,
  verifyMobileSagas,
  watchVerifyMobile,
} from 'ranger-redux/modules/verification/verifyMoblie';

describe('verifyMobile module', () => {
  it('verifyMobile module should be defined', () => {
    expect(verifyMobileReducer).toBeDefined();
    expect(verifyMobileActions).toBeDefined();
    expect(verifyMobileActionTypes).toBeDefined();
  });

  describe('verifyMobile Sagas', () => {
    it('verifyMobileSaga should be defined', () => {
      expect(verifyMobileSagas).toBeDefined();
    });

    it('verifyMobileSaga should yield watchVerifyMobile', () => {
      const gen = verifyMobileSagas();

      assert.deepEqual(
        gen.next().value,
        takeEvery(verifyMobileActionTypes.load, watchVerifyMobile),
        'it should yield watchVerifyMobile',
      );
    });
  });

  describe('watchVerifyMobile', () => {
    it('watchVerifyMobile should be defined', () => {
      expect(watchVerifyMobile).toBeDefined();
    });
    it('verify mobile successfully', () => {
      const gen = watchVerifyMobile({payload: {verificationCode: '200'}, type: verifyMobileActionTypes.load});
      gen.next();

      const response = {
        message: 'verified!',
      };

      assert.deepEqual(
        gen.next({result: response, status: 200}).value,
        put(verifyMobileActions.loadSuccess(response)),
        'dispatch verifyMobileActions success',
      );
    });
    it('verify mobile error', () => {
      const gen = watchVerifyMobile({payload: {verificationCode: ''}, type: verifyMobileActionTypes.load});
      gen.next();
      const error = new Error('Error is here!');

      assert.deepEqual(
        gen.throw(error).value,
        put(verifyMobileActions.loadFailure(error.message)),
        'dispatch verifyMobileActions failure',
      );
    });
  });
});
