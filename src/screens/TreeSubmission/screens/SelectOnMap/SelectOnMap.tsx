import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {TreeSubmissionRouteParamList} from 'types';
import MapMarking from 'screens/TreeSubmission/components/MapMarking';

interface Props {}

function SelectOnMap(_: Props) {
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();

  return (
    <View style={globalStyles.fill}>
      <MapMarking journey={journey} />
      <View pointerEvents="none" style={styles.mapMarkerWrapper}>
        <Image style={styles.mapMarker} source={require('../../../../../assets/icons/map-marker.png')} />
      </View>
    </View>
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
