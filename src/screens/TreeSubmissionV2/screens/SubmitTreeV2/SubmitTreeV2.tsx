import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Spacer from 'components/Spacer';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {SelectTreePhoto} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {onBoardingTwo} from '../../../../../assets/images';
import {mockPlantTreePermissionsChecking} from 'screens/TreeSubmissionV2/components/__test__/mock';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;

  const hasLocation = {
    coords: {
      latitude: 35.7022048,
      longitude: 51.4517922,
    },
    canUpdate: false,
  };

  return (
    <SafeAreaView
      style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill, globalStyles.p1, globalStyles.pt3]}
    >
      <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={mockPlantTreePermissionsChecking} />
      <Spacer times={8} />
      {plantTreePermissions.isLocationGranted ? (
        <SelectTreeLocation
          hasLocation={hasLocation}
          testID="select-tree-location-cpt"
          onSelect={() => console.log('select tree location')}
        />
      ) : (
        <LockedSubmissionField testID="locked-location-cpt" title="lockedField.location" />
      )}
      <Spacer times={3} />
      {plantTreePermissions?.isCameraGranted ? (
        <SelectTreePhoto
          treePhoto={onBoardingTwo}
          testID="select-tree-photo-cpt"
          onSelect={() => console.log('select tree photo')}
        />
      ) : (
        <LockedSubmissionField testID="locked-camera-cpt" title="lockedField.camera" />
      )}
    </SafeAreaView>
  );
}
