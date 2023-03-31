import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyles from 'constants/styles';
import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import {usePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';

export default function TestScreen() {
  const plantTreePermissions = usePlantTreePermissions();
  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
      <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={plantTreePermissions} />
    </SafeAreaView>
  );
}
