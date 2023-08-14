import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import globalStyles from 'constants/styles';
import {MapMarkingV2} from 'screens/TreeSubmissionV2/components/MapMarkingV2/MapMarkingV2';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {MapMarker} from '../../../../../assets/icons';

export type SelectOnMapV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SelectOnMapV2(props: SelectOnMapV2Props) {
  const {plantTreePermissions} = props;
  const {hasLocation, userLocation} = plantTreePermissions;

  const isConnected = useNetInfoConnected();

  return (
    <SafeAreaView style={globalStyles.fill}>
      {isConnected === false ? <SubmitTreeOfflineWebModal testID="offline-modal" /> : null}
      <View style={globalStyles.fill}>
        <MapMarkingV2 testID="map-marking-cpt" permissionHasLocation={hasLocation} userLocation={userLocation} />
        <View pointerEvents="none" style={styles.mapMarkerWrapper}>
          <Image testID="map-marker" style={styles.mapMarker} source={MapMarker} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapMarker: {
    height: 92 / 1.5,
    width: 61 / 1.5,
  },
  mapMarkerWrapper: {
    marginLeft: -32 / 1.5,
    marginTop: -68 / 1.5,
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
});
