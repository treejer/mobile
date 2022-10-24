import React, {useCallback} from 'react';
import {ScreenTitleWithoutNavigation} from 'components/ScreenTitle/ScreenTitleWithoutNavigation';
import {useNavigation} from '@react-navigation/native';
import {Routes} from 'navigation';
import {useProfile} from '../../redux/modules/profile/profile';

export type TScreenTitle = {
  goBack?: boolean;
  title?: string;
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
