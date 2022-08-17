import {View, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import globalStyles from 'constants/styles';
import Card from 'components/Card';
import Icon from 'react-native-vector-icons/Ionicons';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {usePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Button from 'components/Button';
import {openSettings} from 'react-native-permissions';

function CheckingPermissions() {
  const {
    isLocationGranted,
    locationPermission,
    isCameraGranted,
    isLibraryGranted,
    cameraPermission,
    libraryPermission,
  } = usePlantTreePermissions();

  console.log({locationPermission, cameraPermission, libraryPermission});

  const permissions = useMemo(
    () => [
      {
        name: 'Location',
        status: locationPermission ? isLocationGranted ? 'Granted' : <OpenSettingsButton /> : 'Checking...',
        icon: 'md-location-outline',
        styles: {
          box: [
            styles.iconBox,
            styles.flexCenter,
            locationPermission
              ? isLocationGranted
                ? styles.iconBoxGranted
                : styles.iconBoxBlocked
              : styles.iconBoxChecking,
          ],
          txtColor: locationPermission ? (isLocationGranted ? styles.isGranted : styles.isBlocked) : undefined,
        },
      },
      {
        name: 'Camera',
        status: cameraPermission ? isCameraGranted ? 'Granted' : <OpenSettingsButton /> : 'Checking...',
        icon: 'camera-outline',
        styles: {
          box: [
            styles.iconBox,
            styles.flexCenter,
            cameraPermission
              ? isCameraGranted
                ? styles.iconBoxGranted
                : styles.iconBoxBlocked
              : styles.iconBoxChecking,
          ],
          txtColor: cameraPermission ? (isCameraGranted ? styles.isGranted : styles.isBlocked) : undefined,
        },
      },
      {
        name: 'Media',
        status: libraryPermission ? isLibraryGranted ? 'Granted' : <OpenSettingsButton /> : 'Checking...',
        icon: 'images',
        styles: {
          box: [
            styles.iconBox,
            styles.flexCenter,
            libraryPermission
              ? isLibraryGranted
                ? styles.iconBoxGranted
                : styles.iconBoxBlocked
              : styles.iconBoxChecking,
          ],
          txtColor: libraryPermission ? (isLibraryGranted ? styles.isGranted : styles.isBlocked) : undefined,
        },
      },
    ],
    [locationPermission, isLocationGranted, cameraPermission, isCameraGranted, libraryPermission, isLibraryGranted],
  );

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={globalStyles.h4}>We are checking permissions to continue...</Text>
      </View>
      <Card style={{paddingVertical: 0}}>
        {permissions.map((permission, index) => (
          <React.Fragment key={permission.name}>
            <View style={styles.flexBetween}>
              <View style={styles.flexRow}>
                <View style={permission.styles.box}>
                  <Icon style={permission.styles.txtColor} name={permission.icon} size={24} />
                </View>
                <Spacer />
                <Text style={permission.styles.txtColor}>{permission.name}</Text>
              </View>
              <Text style={permission.styles.txtColor}>{permission.status}</Text>
            </View>
            {index !== permissions.length - 1 && <View style={styles.hr} />}
          </React.Fragment>
        ))}
      </Card>
    </View>
  );
}

export default CheckingPermissions;

export function OpenSettingsButton() {
  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('open settings catched'));
  };

  return <Button variant="secondary" caption={'Grant now'} onPress={handleOpenSettings} />;
}

export const styles = StyleSheet.create({
  container: {
    width: '100%',
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
