import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import globalStyles from 'constants/styles';
import {ChevronLeft} from 'components/Icons';
import {colors} from 'constants/values';

export type TScreenTitle = {
  goBack?: boolean;
  title: string;
  rightContent?: React.ReactElement;
};

export function ScreenTitle(props: TScreenTitle) {
  const {goBack, title, rightContent} = props;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {goBack ? (
        <TouchableOpacity
          style={[globalStyles.fill]}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : undefined)}
        >
          <ChevronLeft />
        </TouchableOpacity>
      ) : (
        <View style={globalStyles.fill} />
      )}
      <View style={{flex: 3}}>
        <Text style={[globalStyles.textCenter, styles.title]}>{title}</Text>
      </View>
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
