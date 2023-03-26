import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
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

  console.log(permission);

  const permissionStyles = useMemo(
    () => ({
      text: permission.isExist ? (permission.isGranted ? styles.isGranted : styles.isBlocked) : {},
      iconBox: permission.isExist
        ? permission.isGranted
          ? styles.iconBoxGranted
          : styles.iconBoxBlocked
        : styles.iconBoxChecking,
    }),
    [permission],
  );

  return (
    <View
      testID={testID}
      style={[styles.flexBetween, col && styles.col, col && permission.isGranted && styles.smaller]}
    >
      <TouchableOpacity
        testID="permission-btn-container"
        onPress={() => permission.onPress(permission.isGranted)}
        activeOpacity={permission.isGranted ? 1 : undefined}
        style={col ? styles.col : styles.flexRow}
      >
        <View style={[styles.iconBox, styles.flexCenter, permissionStyles.iconBox]}>
          <Icon testID="permission-icon" style={permissionStyles.text} name={permission.icon} size={24} />
        </View>
        <Spacer times={col ? 1 : 2} />
        <Text style={permissionStyles.text} testID="permission-name">
          {permission.name}
        </Text>
      </TouchableOpacity>
      {!col && (
        <Text style={permissionStyles.text} testID="permission-status">
          {permission.status}
        </Text>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  smaller: {
    transform: [{scale: 0.8}],
  },
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
    paddingVertical: 24,
  },
  title: {
    width: '100%',
    marginBottom: 16,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 50,
    width: 40,
    height: 40,
  },
  iconBoxGranted: {
    borderColor: colors.green,
  },
  iconBoxBlocked: {
    borderColor: colors.red,
  },
  iconBoxChecking: {
    borderColor: colors.gray,
  },
  isGranted: {
    color: colors.green,
  },
  isBlocked: {
    color: colors.red,
  },
});
