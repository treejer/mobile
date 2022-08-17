import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {usePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import CheckingPermissions from 'components/CheckingPermissions/CheckingPermissions';

function CheckPermissions() {
  const {isChecking, requested} = usePlantTreePermissions();
  console.log({isChecking, requested});

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.fill, styles.flexCenter, globalStyles.p1]}>
        <CheckingPermissions />
      </View>
    </SafeAreaView>
  );
}

export default CheckPermissions;

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
    borderColor: colors.gray,
    borderStyle: 'solid',
    borderRadius: 50,
    width: 40,
    height: 40,
  },
});
