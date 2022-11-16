import React from 'react';
import {StyleSheet, View} from 'react-native';

import {TPlace} from 'components/Map/types';
import {PlaceItem} from 'components/Map/PlaceItem';

export type TPlacesListProps = {
  height: number;
  places: TPlace[];
  onLocate: (coordinates: number[]) => void;
};

export function PlacesList(props: TPlacesListProps) {
  const {places, height, onLocate} = props;
  return (
    <View style={[styles.container, {height}]}>
      {places.map((place, index) => (
        <PlaceItem
          key={place.id}
          place={place}
          onLocate={() => onLocate(place.geometry.coordinates)}
          isLast={index === places.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
});
