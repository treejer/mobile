import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import Spacer from 'components/Spacer';
import {TPlace} from 'components/Map/types';
import {PlaceItem} from 'components/Map/PlaceItem';
import {colors} from 'constants/values';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';

export type TPlacesListProps = {
  isEmpty: boolean;
  isRecent: boolean;
  height: number;
  places: TPlace[] | null;
  onLocate: (place: TPlace) => void;
  userLocation?: TUserLocation | null;
};

export function PlacesList(props: TPlacesListProps) {
  const {places, height, isEmpty, isRecent, userLocation, onLocate} = props;

  const {t} = useTranslation();

  return (
    <ScrollView style={[styles.container, {height}]}>
      {isRecent && !isEmpty ? (
        <>
          <Spacer />
          <Text style={styles.recent}>{t('mapMarking.recent')}</Text>
        </>
      ) : null}
      {places?.map((place, index) => {
        return (
          <PlaceItem
            key={`${place.id}-${place.geometry}${place.text}-${index}`}
            place={place}
            onLocate={() => onLocate(place)}
            isLast={index === places?.length - 1}
            isRecent={isRecent}
            userLocation={userLocation}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  recent: {
    fontSize: 16,
    color: colors.grayDarker,
  },
  empty: {
    fontSize: 22,
    textAlign: 'center',
    color: colors.green,
  },
});
