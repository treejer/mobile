import * as actionsList from 'ranger-redux/modules/browserPlatform/browserPlatform.action';

describe('browserPlatform actions', () => {
  it('PROCESS_BROWSER_PLATFORM', () => {
    const expectedAction = {
      type: actionsList.PROCESS_BROWSER_PLATFORM,
    };
    expect(actionsList.processBrowserPlatform()).toEqual(expectedAction);
  });
});
