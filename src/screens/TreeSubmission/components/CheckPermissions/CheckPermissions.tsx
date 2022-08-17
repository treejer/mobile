import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {openSettings} from 'react-native-permissions';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import CheckingPermissions from 'components/CheckingPermissions/CheckingPermissions';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import BlockedPermissions from 'components/CheckingPermissions/BlockedPermissions';

export type TCheckPermissionsProps = {
  plantTreePermissions: TUsePlantTreePermissions;
};

function CheckPermissions(props: TCheckPermissionsProps) {
  const {
    isLocationGranted,
    locationPermission,
    isCameraGranted,
    isLibraryGranted,
    cameraPermission,
    libraryPermission,
    cantProceed,
    isChecking,
  } = props.plantTreePermissions;

  const {t} = useTranslation();

  const permissions = useMemo(
    () => [
      {
        name: t('checkPermission.permissions.location'),
        status: locationPermission ? (
          isLocationGranted ? (
            t('checkPermission.granted')
          ) : (
            <OpenSettingsButton />
          )
        ) : (
          t('checkPermission.checking')
        ),
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
            <OpenSettingsButton />
          )
        ) : (
          t('checkPermission.checking')
        ),
        icon: 'camera-outline',
        isExist: cameraPermission,
        isGranted: isCameraGranted,
      },
      {
        name: t('checkPermission.permissions.media'),
        status: libraryPermission ? (
          isLibraryGranted ? (
            t('checkPermission.granted')
          ) : (
            <OpenSettingsButton />
          )
        ) : (
          t('checkPermission.checking')
        ),
        icon: 'images',
        isExist: libraryPermission,
        isGranted: isLibraryGranted,
      },
    ],
    [t, locationPermission, isLocationGranted, cameraPermission, isCameraGranted, libraryPermission, isLibraryGranted],
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

export function OpenSettingsButton() {
  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('open settings catched'));
  };

  return <Button variant="secondary" caption={'Grant now'} onPress={handleOpenSettings} />;
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
  title: {
    width: '100%',
    marginBottom: 16,
  },
  hr: {
    backgroundColor: colors.grayOpacity,
    height: 1,
    width: '100%',
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
});
