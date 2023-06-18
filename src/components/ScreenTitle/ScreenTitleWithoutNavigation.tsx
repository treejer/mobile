import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import {ChevronLeft} from 'components/Icons';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export type TScreenTitleWithoutNavigation = {
  testID?: string;
  goBack?: boolean;
  handleGoBack?: () => void;
  title?: string;
  textStyle?: TextStyle;
  rightContent?: React.ReactElement;
};

export function ScreenTitleWithoutNavigation(props: TScreenTitleWithoutNavigation) {
  const {testID, goBack, title, textStyle, rightContent, handleGoBack} = props;

  return (
    <View testID={testID} style={styles.container}>
      {goBack && handleGoBack ? (
        <TouchableOpacity
          style={[globalStyles.fill, globalStyles.justifyContentCenter, {alignSelf: 'stretch'}]}
          onPress={handleGoBack}
        >
          <ChevronLeft color={colors.black} />
        </TouchableOpacity>
      ) : (
        <View style={globalStyles.fill} />
      )}
      {title && (
        <View style={{flex: 4, justifyContent: 'center'}}>
          <Text testID="screen-title-text" style={[globalStyles.textCenter, styles.title, textStyle]}>
            {title}
          </Text>
        </View>
      )}
      {rightContent ? (
        <View
          style={[globalStyles.fill, globalStyles.justifyContentCenter, styles.alignItemsEnd, {alignSelf: 'stretch'}]}
        >
          {rightContent}
        </View>
      ) : (
        <View style={globalStyles.fill} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
