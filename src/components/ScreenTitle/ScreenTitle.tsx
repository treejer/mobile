import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Routes} from 'navigation';
import {ChevronLeft} from 'components/Icons';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {useProfile} from '../../redux/modules/profile/profile';

export type TScreenTitle = {
  goBack?: boolean;
  title?: string;
  rightContent?: React.ReactElement;
};

export function ScreenTitle(props: TScreenTitle) {
  const {goBack, title, rightContent} = props;

  const {profile} = useProfile();

  const navigation = useNavigation();

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // @ts-ignore
      navigation.navigate(profile.isVerified ? Routes.VerifiedProfileTab : Routes.UnVerifiedProfileStack);
    }
  }, [navigation, profile]);

  return (
    <View style={styles.container}>
      {goBack && navigation.goBack ? (
        <TouchableOpacity style={[globalStyles.fill]} onPress={handleGoBack}>
          <ChevronLeft />
        </TouchableOpacity>
      ) : (
        <View style={globalStyles.fill} />
      )}
      {title && (
        <View style={{flex: 4}}>
          <Text style={[globalStyles.textCenter, styles.title]}>{title}</Text>
        </View>
      )}
      {rightContent ? (
        <View style={[globalStyles.fill, globalStyles.justifyContentCenter, styles.alignItemsEnd]}>{rightContent}</View>
      ) : (
        <View style={globalStyles.fill} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.black,
  },
});
