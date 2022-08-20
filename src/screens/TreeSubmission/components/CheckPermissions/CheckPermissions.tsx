import React, {useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import CheckingPermissions from 'components/CheckingPermissions/CheckingPermissions';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import BlockedPermissions from 'components/CheckingPermissions/BlockedPermissions';
import {TPermissionItem} from 'components/CheckingPermissions/PermissionItem';
import {isWeb} from 'utilities/helpers/web';

export type TCheckPermissionsProps = {
  plantTreePermissions: TUsePlantTreePermissions;
};

function CheckPermissions(props: TCheckPermissionsProps) {
  const {
    cameraPermission,
    locationPermission,
    isLocationGranted,
    isCameraGranted,
    isGPSEnabled,
    cantProceed,
    isChecking,
    hasLocation,
    openPermissionsSettings,
    requestCameraPermission,
    requestLocationPermission,
    openGpsRequest,
  } = props.plantTreePermissions;

  const {t} = useTranslation();

  useEffect(() => {
    console.log({cantProceed, isChecking}, 'check');
    console.log({hasLocation, isGPSEnabled}, 'GPS');
    console.log({isCameraGranted, isLocationGranted}, 'permissions');
  }, [cantProceed, hasLocation, isCameraGranted, isChecking, isGPSEnabled, isLocationGranted]);

  const permissions: TPermissionItem['permission'][] = useMemo(
    () => [
      {
        name: t('checkPermission.permissions.location'),
        status: locationPermission ? (
          isLocationGranted ? (
            t('checkPermission.granted')
          ) : (
            <OpenSettingsButton
              caption={t('checkPermission.grantNow')}
              onPress={() => (isWeb() ? requestLocationPermission(false) : openPermissionsSettings(false))}
            />
          )
        ) : (
          t('checkPermission.checking')
        ),
        onPress: isWeb() ? requestLocationPermission : openPermissionsSettings,
        icon: 'md-location-outline',
        isExist: locationPermission,
        isGranted: isLocationGranted,
      },
      {
        name: t('checkPermission.permissions.camera'),
        status: cameraPermission ? (
          isCameraGranted ? (
            t('checkPermission.granted')
          ) : (
            <OpenSettingsButton
              caption={t('checkPermission.grantNow')}
              onPress={() => (isWeb() ? requestCameraPermission(false) : openPermissionsSettings(false))}
            />
          )
        ) : (
          t('checkPermission.checking')
        ),
        onPress: isWeb() ? requestCameraPermission : openPermissionsSettings,
        icon: 'camera-outline',
        isExist: cameraPermission,
        isGranted: isCameraGranted,
      },
      {
        name: t('checkPermission.permissions.GPS'),
        status: isGPSEnabled ? (
          hasLocation ? (
            t('checkPermission.enabled')
          ) : (
            <OpenSettingsButton caption={t('checkPermission.turnOn')} onPress={() => openGpsRequest(false)} />
          )
        ) : (
          t('checkPermission.checking')
        ),
        onPress: openGpsRequest,
        icon: 'locate',
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

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.fill, !cantProceed && styles.flexCenter, globalStyles.p1]}>
        <Spacer times={4} />
        {!isChecking && cantProceed && (
          <>
            <BlockedPermissions permissions={permissions} />
            <Spacer times={14} />
          </>
        )}
        <CheckingPermissions permissions={permissions} cantProceed={cantProceed} />
      </View>
    </SafeAreaView>
  );
}

export default CheckPermissions;

export type TOpenSettingsButtonProps = {
  caption: string;
  onPress: () => void | Promise<void> | undefined;
};

export function OpenSettingsButton(props: TOpenSettingsButtonProps) {
  const {caption, onPress} = props;

  return <Button variant="secondary" caption={caption} onPress={onPress} />;
}

const styles = StyleSheet.create({
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
});
