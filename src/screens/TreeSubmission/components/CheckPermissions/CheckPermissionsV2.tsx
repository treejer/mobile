import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation, Trans} from 'react-i18next';
import Fa5Icon from 'react-native-vector-icons/FontAwesome';
import IoIcon from 'react-native-vector-icons/Ionicons';

import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {PermissionItem, TPermissionItem} from 'components/CheckingPermissions/PermissionItem';
import {isWeb} from 'utilities/helpers/web';
import Card from 'components/Card';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';

export type TCheckPermissionsProps = {
  testID?: string;
  plantTreePermissions: TUsePlantTreePermissions;
};

export function CheckPermissionsV2(props: TCheckPermissionsProps) {
  const {
    cameraPermission,
    locationPermission,
    isLocationGranted,
    isCameraGranted,
    isGPSEnabled,
    cantProceed,
    isChecking,
    isGranted,
    hasLocation,
    openPermissionsSettings,
    requestCameraPermission,
    requestLocationPermission,
    openGpsRequest,
  } = props.plantTreePermissions;

  const {t} = useTranslation();

  const permissions: TPermissionItem['permission'][] = useMemo(
    () => [
      {
        name: t('checkPermission.permissions.location'),
        status: locationPermission
          ? isLocationGranted
            ? t('checkPermission.granted')
            : t('checkPermission.blocked')
          : t('checkPermission.checking'),
        onPress: isWeb() ? requestLocationPermission : openPermissionsSettings,
        icon: 'location-arrow',
        isExist: locationPermission,
        isGranted: isLocationGranted,
      },
      {
        name: t('checkPermission.permissions.camera'),
        status: cameraPermission
          ? isCameraGranted
            ? t('checkPermission.granted')
            : t('checkPermission.blocked')
          : t('checkPermission.checking'),
        onPress: isWeb() ? requestCameraPermission : openPermissionsSettings,
        icon: 'camera',
        isExist: cameraPermission,
        isGranted: isCameraGranted,
      },
      {
        name: t('checkPermission.permissions.GPS'),
        status: isGPSEnabled
          ? hasLocation
            ? t('checkPermission.enabled')
            : t('checkPermission.blocked')
          : t('checkPermission.checking'),
        onPress: openGpsRequest,
        icon: 'map-marker-alt',
        isExist: isGPSEnabled,
        isGranted: hasLocation,
      },
    ],
    [
      t,
      locationPermission,
      isLocationGranted,
      requestLocationPermission,
      openPermissionsSettings,
      cameraPermission,
      isCameraGranted,
      requestCameraPermission,
      isGPSEnabled,
      hasLocation,
      openGpsRequest,
    ],
  );

  // TODO:  loading state

  return (
    <Card testID={props?.testID} style={[globalStyles.screenView, styles.container]}>
      <View style={[styles.flexRow, styles.boxesPadding]}>
        {!isChecking ? (
          <Fa5Icon
            testID="permission-box-icon"
            style={cantProceed ? styles.warningIcon : styles.checkIcon}
            name={cantProceed ? 'warning' : 'check-circle'}
            size={cantProceed ? 24 : 26}
          />
        ) : null}
        <Spacer />
        <Text testID="permission-box-title" style={[styles.title, isGranted ? styles.greenTextColor : null]}>
          {t(cantProceed ? 'permissionBox.grantToContinue' : 'permissionBox.allGranted')}
        </Text>
      </View>
      <Spacer />
      <Hr />
      {cantProceed ? (
        <View testID="permissions-list" style={[styles.flexBetween, styles.boxesPadding]}>
          {permissions.map(permission => (
            <PermissionItem key={permission.name} permission={permission} col />
          ))}
        </View>
      ) : (
        <Spacer />
      )}
      {cantProceed ? (
        <View style={styles.boxesPadding}>
          <Text style={styles.guideText}>
            <Trans
              testID="permission-box-guide"
              i18nKey="permissionBox.guide"
              components={{
                Red: <Text style={styles.redTextColor} />,
                Grant: <Text style={styles.greenTextColor} />,
              }}
            />
          </Text>
        </View>
      ) : (
        <View testID="permission-box-plant-settings" style={styles.boxesPadding}>
          <View style={[styles.flexBetween, {paddingVertical: 0}]}>
            <View style={styles.flexRow}>
              <IoIcon testID="settings-icon" name="settings-outline" size={24} color={colors.grayDarker} />
              <Spacer />
              <Text testID="permission-box-open-settings-text" style={styles.title}>
                {t('permissionBox.submissionSettings')}
              </Text>
            </View>
            <IoIcon testID="settings-chevron-icon" name="chevron-forward" size={24} color={colors.grayDarker} />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  boxesPadding: {
    paddingHorizontal: 12,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  warningIcon: {
    color: colors.red,
  },
  checkIcon: {
    color: colors.green,
  },
  title: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  guideText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  redTextColor: {
    color: colors.red,
  },
  greenTextColor: {
    color: colors.green,
  },
});
