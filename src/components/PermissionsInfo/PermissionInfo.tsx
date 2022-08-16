import React from 'react';
import globalStyles from 'constants/styles';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {usePlantTreejerPermissions} from 'utilities/hooks/userPlantTreePermissions';
import {colors} from 'constants/values';

function PermissionsInfo() {
  const {cameraPermission, locationPermission} = usePlantTreejerPermissions();
  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.fill, styles.container]}>
        <View style={styles.permissionBox}>
          <Text style={[styles.textCenter, globalStyles.h5, globalStyles.mb1]}>please allow all permissions</Text>
          <View style={styles.permissionItem}>
            <Text>camera:</Text>
            <Text>{cameraPermission}</Text>
          </View>
          <View style={styles.permissionItem}>
            <Text>location:</Text>
            <Text>{locationPermission}</Text>
          </View>
          <Text style={[globalStyles.body2, globalStyles.mt3, styles.textCenter]}>Go to settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PermissionsInfo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  permissionBox: {
    borderColor: colors.claimed,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: 300,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  textCenter: {
    textAlign: 'center',
  },
});
