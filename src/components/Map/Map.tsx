import React, {forwardRef, LegacyRef} from 'react';
import MapboxGL, {MapViewProps} from '@rnmapbox/maps';
import {mapboxPrivateToken} from 'services/config';

import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(mapboxPrivateToken);

type Props = MapViewProps;

export interface MapProps extends Props {
  children?: any;
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef((props: MapProps, ref: LegacyRef<any>) => {
  return <MapboxGL.MapView logoEnabled={false} {...props} ref={ref} />;
});

export default Map;
