import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import MapMarking from 'screens/TreeSubmission/components/MapMarking/MapMarking';
import {GeoPosition} from 'react-native-geolocation-service';
import {Routes, UnVerifiedUserNavigationProp} from 'navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';

interface Props extends UnVerifiedUserNavigationProp<Routes.SelectOnMapVerifyProfile> {}

function SelectOnMapVerifyProfile(props: Props) {
  const {navigation, route} = props;
  const {params} = route;
  const {journey} = params || {};
  const isConnected = useNetInfoConnected();

  const handleSubmit = useCallback(
    (location: GeoPosition) => {
      const {coords} = location;
      navigation.navigate(Routes.VerifyProfile, {
        journey: {
          ...journey,
          location: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        },
      });
    },
    [navigation, journey],
  );

  return (
    <SafeAreaView style={globalStyles.fill}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <View style={globalStyles.fill}>
        <View style={styles.container}>
          <MapMarking onSubmit={handleSubmit} />
        </View>
        <View pointerEvents="none" style={styles.mapMarkerWrapper}>
          <Image style={styles.mapMarker} source={require('../../../../../assets/icons/map-marker.png')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bottom: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingBottom: 30,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default SelectOnMapVerifyProfile;
