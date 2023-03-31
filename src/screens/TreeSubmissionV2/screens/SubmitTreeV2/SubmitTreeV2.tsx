import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Spacer from 'components/Spacer';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;

  return (
    <SafeAreaView
      style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill, globalStyles.p1, globalStyles.pt3]}
    >
      <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={plantTreePermissions} />
      <Spacer times={8} />
      {plantTreePermissions.isLocationGranted ? (
        <SelectTreeLocation testID="select-tree-location-cpt" onSelect={() => console.log('select tree location')} />
      ) : (
        <LockedSubmissionField testID="locked-location-cpt" title="lockedField.location" />
      )}
      <Spacer times={3} />
      <LockedSubmissionField testID="locked-camera-cpt" title="lockedField.camera" />
    </SafeAreaView>
  );
}
