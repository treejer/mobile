import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import MapMarking from 'screens/TreeSubmission/components/MapMarking/MapMarking';
import {RootNavigationProp, Routes} from 'navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';

interface Props extends RootNavigationProp<Routes.SelectOnMap> {}

function SelectOnMap(props: Props) {
  const {route} = props;
  const {
    params: {journey},
  } = route;

  const isConnected = useNetInfoConnected();

  return (
    <SafeAreaView style={globalStyles.fill}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <View style={globalStyles.fill}>
        <MapMarking journey={journey} />
        <View pointerEvents="none" style={styles.mapMarkerWrapper}>
          <Image style={styles.mapMarker} source={require('../../../../../assets/icons/map-marker.png')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  word: {
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1,
  },
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

export default SelectOnMap;
