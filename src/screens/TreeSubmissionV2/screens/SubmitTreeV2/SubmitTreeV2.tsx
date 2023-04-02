import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Spacer from 'components/Spacer';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {SelectTreePhoto} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {colors} from 'constants/values';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;

  const {t} = useTranslation();

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.p1, globalStyles.pt1]}>
          <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={plantTreePermissions} />
          <Spacer times={6} />
          <Text testID="submission-title" style={styles.title}>
            {t('submitTreeV2.titles.plantSingle')}
          </Text>
          <Spacer times={4} />
          {plantTreePermissions?.isCameraGranted ? (
            <SelectTreePhoto testID="select-tree-photo-cpt" onSelect={() => console.log('select tree photo')} />
          ) : (
            <LockedSubmissionField testID="locked-camera-cpt" title="lockedField.camera" />
          )}
          <Spacer times={3} />
          {plantTreePermissions.isLocationGranted && plantTreePermissions.isGPSEnabled ? (
            <SelectTreeLocation
              testID="select-tree-location-cpt"
              onSelect={() => console.log('select tree location')}
            />
          ) : (
            <LockedSubmissionField testID="locked-location-cpt" title="lockedField.location" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.tooBlack,
  },
});
