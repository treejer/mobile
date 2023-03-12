import React, {forwardRef, LegacyRef} from 'react';
import MapboxGL from '@rnmapbox/maps';

import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';

type Props = typeof MapboxGL.MapView.defaultProps;

export interface MapProps extends Props {
  children?: any;
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef((props: MapProps, ref: LegacyRef<any>) => {
  return <MapboxGL.MapView logoEnabled={false} {...props} ref={ref} />;
});

export default Map;
