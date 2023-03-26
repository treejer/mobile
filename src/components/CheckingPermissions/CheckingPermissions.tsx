import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import Card from 'components/Card';
import {colors} from 'constants/values';
import {PermissionItem, TPermissionItem} from 'components/CheckingPermissions/PermissionItem';
import Spacer from 'components/Spacer';

export type TCheckingPermissions = {
  testID?: string;
  cantProceed: boolean;
  permissions: TPermissionItem['permission'][];
};

function CheckingPermissions(props: TCheckingPermissions) {
  const {cantProceed, permissions, testID} = props;
  const {t} = useTranslation();

  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.title}>
        <Text style={globalStyles.h4} testID="checkingPermissions-title">
          {cantProceed ? t('checkPermission.wrong') : t('checkPermission.checkingTitle')}
        </Text>
        {cantProceed && (
          <>
            <Spacer />
            <Text style={globalStyles.h6} testID="checkingPermissions-be-sure">
              {t('checkPermission.toBeSure')}
            </Text>
          </>
        )}
      </View>
      <Spacer />
      <Card testID="permissions-list" style={styles.cardPadding}>
        {permissions.map((permission, index) => (
          <React.Fragment key={permission.name}>
            <PermissionItem permission={permission} />
            {index !== permissions.length - 1 && <View style={styles.hr} />}
          </React.Fragment>
        ))}
      </Card>
    </View>
  );
}

export default CheckingPermissions;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardPadding: {
    paddingVertical: 0,
  },
  title: {
    width: '100%',
    marginBottom: 16,
  },
  hr: {
    backgroundColor: colors.grayOpacity,
    height: 1,
    width: '100%',
  },
});
