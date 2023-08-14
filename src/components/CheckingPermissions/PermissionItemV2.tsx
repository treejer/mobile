import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export type TPermissionItem = {
  testID?: string;
  permission: {
    name: string;
    isExist: string | boolean | null;
    status: string | JSX.Element;
    icon: string;
    isGranted: boolean;
    onPress: (isGranted: boolean) => void | Promise<void> | undefined;
  };
};

export function PermissionItemV2(props: TPermissionItem) {
  const {permission, testID} = props;

  const {t} = useTranslation();

  const permissionStyles = useMemo(
    () => ({
      statusText: permission.isExist ? (permission.isGranted ? styles.isGranted : styles.isBlocked) : styles.isChecking,
      text: permission.isExist ? styles.whiteText : {},
      iconBox: permission.isExist
        ? permission.isGranted
          ? styles.iconBoxGranted
          : styles.iconBoxBlocked
        : styles.iconBoxChecking,
    }),
    [permission],
  );

  return (
    <View testID={testID} style={[styles.flexBetween, styles.col]}>
      <TouchableOpacity
        testID="permission-btn-container"
        onPress={() => permission.onPress(permission.isGranted)}
        activeOpacity={permission.isGranted || !permission.isExist ? 1 : undefined}
        style={styles.col}
      >
        <Text style={styles.blackText} testID="permission-name">
          {t(permission.name)}
        </Text>
        <Spacer times={1} />
        <View testID="permission-icon-container" style={[styles.iconBox, styles.flexCenter, permissionStyles.iconBox]}>
          <Icon testID="permission-icon" style={permissionStyles.text} name={permission.icon} size={24} />
        </View>
        <Text style={permissionStyles.statusText} testID="permission-status">
          {t(permission.status)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  col: {
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    borderRadius: 50,
    width: 64,
    height: 64,
  },
  iconBoxGranted: {
    backgroundColor: colors.green,
  },
  iconBoxBlocked: {
    backgroundColor: colors.red,
  },
  iconBoxChecking: {
    backgroundColor: colors.grayLighter,
  },
  blackText: {
    fontWeight: '400',
    fontSize: 14,
    color: colors.black,
  },
  whiteText: {
    color: colors.khaki,
  },
  isGranted: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '300',
  },
  isBlocked: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '300',
  },
  isChecking: {
    color: colors.grayDarker,
    fontSize: 14,
    fontWeight: '300',
  },
});
