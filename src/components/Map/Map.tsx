import React, {ForwardedRef, forwardRef, LegacyRef, useEffect, useState} from 'react';
import MapboxGL, {MapViewProps} from '@react-native-mapbox-gl/maps';
import {useConfig} from 'services/web3';

const Map: ForwardedRef<MapViewProps> = forwardRef((props: MapViewProps, ref: LegacyRef<any>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const config = useConfig();

  useEffect(() => {
    MapboxGL.setAccessToken(config.mapboxToken);
    setLoading(false);
  }, [config.mapboxToken]);

  if (loading) {
    return null;
  }

  return <MapboxGL.MapView logoEnabled={false} {...props} ref={ref} />;
});

export default Map;
