import React from 'react';
import {Text, View} from 'react-native';
import MapBox from '../../../../components/Map/Map';
import {locationType} from './MapMarking.web';

interface MapProps {
  setLocation: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Map({setLocation, setAccuracyInMeters}: MapProps) {
  return (
    <View>
      <MapBox setLocation={setLocation} setAccuracyInMeters={setAccuracyInMeters} />
    </View>
  );
}
