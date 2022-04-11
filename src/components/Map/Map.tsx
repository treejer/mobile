import React, {forwardRef, LegacyRef, useEffect, useState} from 'react';
import MapboxGL, {MapViewProps} from '@react-native-mapbox-gl/maps';
import {useConfig} from 'services/web3';
import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';

export interface MapProps extends MapViewProps {
  // children?: ReactNode | Element;
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef((props: MapProps, ref: LegacyRef<any>) => {
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
