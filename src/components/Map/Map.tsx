import React, {forwardRef, LegacyRef} from 'react';
import MapboxGL, {MapViewProps} from '@react-native-mapbox-gl/maps';
import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';
import {mapboxPrivateToken} from 'services/config';

MapboxGL.setAccessToken(mapboxPrivateToken);

export interface MapProps extends MapViewProps {
  // children?: ReactNode | Element;
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef((props: MapProps, ref: LegacyRef<any>) => {
  return <MapboxGL.MapView logoEnabled={false} {...props} ref={ref} />;
});

export default Map;
