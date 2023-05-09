import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  verifyProfileActions,
  verifyProfileActionTypes,
  verifyProfileReducer,
  verifyProfileSagas,
  watchVerifyProfile,
} from 'ranger-redux/modules/verification/verifyProfile';
import {TVerifyProfilePayload} from 'webServices/verification/verifyProfile';

describe('verifyProfile module', () => {
  it('verifyProfile module should be defined', () => {
    expect(verifyProfileReducer).toBeDefined();
    expect(verifyProfileActions).toBeDefined();
    expect(verifyProfileActionTypes).toBeDefined();
  });

  describe('verifyProfile sagas', () => {
    it('verifyProfile sagas should be defined', () => {
      expect(verifyProfileSagas).toBeDefined();
    });

    it('verifyProfile sagas should yield verify profile watcher', () => {
      const gen = verifyProfileSagas();
      assert.deepEqual(
        gen.next().value,
        takeEvery(verifyProfileActionTypes.load, watchVerifyProfile),
        'it should yield watchVerifyProfile',
      );
    });
  });
  describe('watchVerifyProfile', () => {
    it('watchVerifyProfile should be defined', () => {
      expect(watchVerifyProfile).toBeDefined();
    });
    const input: TVerifyProfilePayload = {
      file: '',
      firstName: 'John',
      lastName: 'Doe',
      latitude: 112121,
      longitude: 211231,
      type: 1,
      organizationAddress: '',
      referrer: '',
    };

    it('verify profile successfully', () => {
      const gen = watchVerifyProfile({payload: input, type: verifyProfileActionTypes.load});
      gen.next();
      assert.deepEqual(
        gen.next({result: '', status: 200}).value,
        put(verifyProfileActions.loadSuccess('')),
        'dispatch verifyProfileActions success',
      );
    });

    it('verify profile error', () => {
      const gen = watchVerifyProfile({payload: input, type: verifyProfileActionTypes.load});
      gen.next();
      const error = new Error('error is here');
      assert.deepEqual(
        gen.throw(error).value,
        put(verifyProfileActions.loadFailure(error.message)),
        'dispatch verifyProfileAction failure',
      );
    });
  });
});
