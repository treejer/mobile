import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {PermissionItem, TPermissionItem} from 'components/CheckingPermissions/PermissionItem';
import {useTranslation} from 'react-i18next';

export type TBlockedPermissions = {
  testID?: string;
  permissions: TPermissionItem['permission'][];
};

function BlockedPermissions(props: TBlockedPermissions) {
  const {permissions, testID} = props;

  const {t} = useTranslation();

  const blockedPermissions = useMemo(() => permissions.filter(permission => !permission.isGranted), [permissions]);
  const grantedPermissions = useMemo(() => permissions.filter(permission => permission.isGranted), [permissions]);

  return (
    <Card testID={testID}>
      <Text style={globalStyles.h4} testID="cantProceed-title">
        {t('checkPermission.cantProceed')}
      </Text>
      <Spacer />
      <Text style={globalStyles.h6} testID="cantProceed-desc">
        {t('checkPermission.cantProceedDesc')}
      </Text>
      <Spacer times={4} />
      <View style={styles.flexBetween}>
        <View style={styles.flexRow} testID="blocked-permission-items">
          {blockedPermissions.map(permission => (
            <React.Fragment key={permission.name}>
              <PermissionItem permission={permission} col />
              <Spacer times={4} />
            </React.Fragment>
          ))}
        </View>
        <View style={styles.flexRow} testID="granted-permission-items">
          {grantedPermissions.map(permission => (
            <React.Fragment key={permission.name}>
              <Spacer times={4} />
              <PermissionItem permission={permission} col />
            </React.Fragment>
          ))}
        </View>
      </View>
    </Card>
  );
}

export default BlockedPermissions;

export const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
