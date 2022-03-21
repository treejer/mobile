import React, {useEffect, useState} from 'react';
import ReactMapboxGl, {Layer, Feature} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {View} from 'react-native';
import {useConfig} from 'services/web3';

export function Map() {
  const [MapBox, setMapBox] = useState<any>();
  const config = useConfig();

  useEffect(() => {
    if (config.mapboxPublicToken) {
      setMapBox(
        ReactMapboxGl({
          accessToken: config.mapboxPublicToken,
        }),
      );
    }
  }, [config.mapboxPublicToken, config.mapboxToken]);

  if (!MapBox) {
    return null;
  }

  return (
    <View>
      <MapBox
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
      >
        <Layer type="symbol" id="marker" layout={{'icon-image': 'marker-15'}}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </MapBox>
    </View>
  );
}
