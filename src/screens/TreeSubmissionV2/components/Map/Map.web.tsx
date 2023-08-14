import React from 'react';
import {View} from 'react-native';

import {locationType} from '../MapMarkingV2/MapMarkingV2.web';
import MapBox from '../../../../components/Map/Map';

interface MapProps {
  map?: any;
  setLocation: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Map({setLocation, setAccuracyInMeters, map}: MapProps) {
  return (
    <View>
      <MapBox ref={map} setLocation={setLocation} setAccuracyInMeters={setAccuracyInMeters} compassEnabled />
    </View>
  );
}
