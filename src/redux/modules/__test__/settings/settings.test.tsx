import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {defaultLocale} from 'services/config';
import * as settings from 'ranger-redux/modules/settings/settings';

describe('settings actions', () => {
  it('mark onboarding done', () => {
    const expectedAction = {
      type: settings.MARK_ONBOARDING_DONE,
    };
    expect(settings.markOnBoardingDone()).toEqual(expectedAction);
  });
  it('rest onboarding data', () => {
    const expectedAction = {
      type: settings.RESET_ONBOARDING_DATA,
    };
    expect(settings.resetOnBoardingData()).toEqual(expectedAction);
  });
  it('update locale', () => {
    const expectedAction = {
      type: settings.UPDATE_LOCALE,
      locale: 'en',
    };
    expect(settings.updateLocale('en')).toEqual(expectedAction);
  });
  it('change use biconomy', () => {
    const expectedAction = {
      type: settings.CHANGE_USE_BICONOMY,
      useBiconomy: true,
    };
    expect(settings.changeUseBiconomy(true)).toEqual(expectedAction);
  });
  it('change check metadata', () => {
    const expectedAction = {
      type: settings.CHANGE_CHECK_METADATA,
      checkMetaData: true,
    };
    expect(settings.changeCheckMetaData(true)).toEqual(expectedAction);
  });
  it('set show support chat', () => {
    const expectedAction = {
      type: settings.SET_SHOW_SUPPORT_CHAT,
      showSupportChat: true,
    };
    expect(settings.setShowSupportChat(true)).toEqual(expectedAction);
  });
});

describe('settings reducer', () => {
  const initialSettingsState: settings.TSettings = {
    onBoardingDone: false,
    locale: defaultLocale,
    checkMetadataReleaseDate: 1672159176038,
    useBiconomy: true,
    checkMetaData: true,
    showSupportChat: false,
  };
  it('should return initialState', () => {
    expect(settings.settingsReducer(initialSettingsState, {type: ''} as any)).toEqual(initialSettingsState);
  });

  it('should handle MARK_ONBOARDING_DONE', () => {
    const expectedState = {
      ...initialSettingsState,
      onBoardingDone: true,
    };
    expect(settings.settingsReducer(initialSettingsState, settings.markOnBoardingDone() as any)).toEqual(expectedState);
  });
  it('should handle RESET_ONBOARDING_DATA', () => {
    const expectedState = {
      ...initialSettingsState,
      onBoardingDone: false,
    };
    expect(settings.settingsReducer(initialSettingsState, settings.resetOnBoardingData() as any)).toEqual(
      expectedState,
    );
  });
  it('should handle UPDATE_LOCALE', () => {
    const expectedState = {
      ...initialSettingsState,
      locale: 'en',
    };
    expect(settings.settingsReducer(initialSettingsState, settings.updateLocale('en') as any)).toEqual(expectedState);
  });
  it('should handle CHANGE_USE_BICONOMY', () => {
    const expectedState = {
      ...initialSettingsState,
      useBiconomy: false,
    };
    expect(settings.settingsReducer(initialSettingsState, settings.changeUseBiconomy(false) as any)).toEqual(
      expectedState,
    );
  });
  it('should handle CHANGE_CHECK_METADATA', () => {
    const expectedState = {
      ...initialSettingsState,
      checkMetaData: false,
    };
    expect(settings.settingsReducer(initialSettingsState, settings.changeCheckMetaData(false) as any)).toEqual(
      expectedState,
    );
  });
  it('should handle SET_SHOW_SUPPORT_CHAT', () => {
    const expectedState = {
      ...initialSettingsState,
      showSupportChat: true,
    };
    expect(settings.settingsReducer(initialSettingsState, settings.setShowSupportChat(true) as any)).toEqual(
      expectedState,
    );
  });
});

describe('settings hook', () => {
  const initialSettingsState: settings.TSettings = {
    onBoardingDone: false,
    locale: defaultLocale,
    checkMetadataReleaseDate: 1672159176038,
    useBiconomy: true,
    checkMetaData: true,
    showSupportChat: false,
  };

  const {result} = renderHook(() => settings.useSettings(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{settings: initialSettingsState}} />,
  });

  it('should return settings state', () => {
    expect(result.current.onBoardingDone).toBe(false);
    expect(result.current.locale).toBe(defaultLocale);
    expect(result.current.checkMetadataReleaseDate).toBe(1672159176038);
    expect(result.current.useBiconomy).toBe(true);
    expect(result.current.checkMetaData).toBe(true);
    expect(result.current.showSupportChat).toBe(false);
  });
});
