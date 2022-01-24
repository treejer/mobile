import React, {ForwardedRef, forwardRef, LegacyRef} from 'react';
import MapboxGL, {MapViewProps} from '@react-native-mapbox-gl/maps';
import config from 'services/config';

MapboxGL.setAccessToken(config.mapboxToken);

const Map: ForwardedRef<MapViewProps> = forwardRef((props: MapViewProps, ref: LegacyRef<any>) => {
  return <MapboxGL.MapView logoEnabled={false} {...props} ref={ref} />;
});

export default Map;
