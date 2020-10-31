import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Button from 'components/Button';
import {Check, Times} from 'components/Icons';

interface Props {}

function SelectOnMap(props: Props) {
  const [region, setRegion] = useState<Region>({
    latitude: 37,
    longitude: -122,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        return;
      }

      const {
        coords: {latitude, longitude},
      } = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={globalStyles.fill}>
      <MapView style={[globalStyles.fill]} region={region} onRegionChangeComplete={setRegion}></MapView>
      <View pointerEvents="none" style={styles.mapMarkerWrapper}>
        <Image style={styles.mapMarker} source={require('../../../../../assets/icons/map-marker.png')} />
      </View>
      <View style={[styles.bottom, globalStyles.horizontalStack]}>
        <Button caption="" icon={Times} variant="primary" round />
        <View style={globalStyles.fill} />
        <Button caption="" icon={Check} variant="success" round />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default SelectOnMap;
