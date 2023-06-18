import React, {useCallback} from 'react';
import {ScreenTitleWithoutNavigation} from 'components/ScreenTitle/ScreenTitleWithoutNavigation';
import {useNavigation} from '@react-navigation/native';
import {Routes} from 'navigation/index';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {TextStyle} from 'react-native';

export type TScreenTitle = {
  testID?: string;
  goBack?: boolean;
  title?: string;
  textStyle?: TextStyle;
  rightContent?: React.ReactElement;
};

export function ScreenTitle(props: TScreenTitle) {
  const navigation = useNavigation();

  const {profile} = useProfile();

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // @ts-ignore
      navigation.navigate(profile.isVerified ? Routes.VerifiedProfileTab : Routes.UnVerifiedProfileStack);
    }
  }, [navigation, profile]);

  return <ScreenTitleWithoutNavigation {...props} handleGoBack={handleGoBack} />;
}
