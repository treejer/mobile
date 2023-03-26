import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

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
  col?: boolean;
};

export function PermissionItem(props: TPermissionItem) {
  const {permission, col, testID} = props;

  const permissionStyles = useMemo(
    () => ({
      statusText: permission.isExist ? (permission.isGranted ? styles.isGranted : styles.isBlocked) : {},
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
    <View testID={testID} style={[styles.flexBetween, col && styles.col]}>
      <TouchableOpacity
        testID="permission-btn-container"
        onPress={() => permission.onPress(permission.isGranted)}
        activeOpacity={permission.isGranted ? 1 : undefined}
        style={col ? styles.col : styles.flexRow}
      >
        <Text style={styles.blackText} testID="permission-name">
          {permission.name}
        </Text>
        <Spacer times={col ? 1 : 2} />
        <View testID="permission-icon-container" style={[styles.iconBox, styles.flexCenter, permissionStyles.iconBox]}>
          <Icon testID="permission-icon" style={permissionStyles.text} name={permission.icon} size={24} />
        </View>
        <Text style={permissionStyles.statusText} testID="permission-status">
          {permission.status}
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
    backgroundColor: colors.gray,
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
});
