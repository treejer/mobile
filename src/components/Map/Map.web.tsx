import React, {ForwardedRef, forwardRef} from 'react';
import ReactMapboxGl, {Layer, Feature} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Text, View} from 'react-native';
import config from 'services/config';

const MapBox = ReactMapboxGl({
  accessToken: config.mapboxPublicToken,
});

export function Map() {
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
