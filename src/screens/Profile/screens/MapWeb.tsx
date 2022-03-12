import React from 'react';
import ReactMapboxGl, {Layer, Feature} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Text, View} from 'react-native';
import config from 'services/config';

export function MapWeb() {
  const Map = ReactMapboxGl({
    accessToken: config.mapboxPublicToken,
  });
  return (
    <View>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
      >
        <Layer type="symbol" id="marker" layout={{'icon-image': 'marker-15'}}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    </View>
  );
}
