import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Spacer from 'components/Spacer';
import {TPlace} from 'components/Map/types';
import {PlaceItem} from 'components/Map/PlaceItem';
import {colors} from 'constants/values';

export type TPlacesListProps = {
  isEmpty: boolean;
  height: number;
  places: TPlace[] | null;
  recentPlaces: TPlace[] | null;
  onLocate: (place: TPlace) => void;
};

export function PlacesList(props: TPlacesListProps) {
  const {places, recentPlaces, height, isEmpty, onLocate} = props;

  const {t} = useTranslation();

  return (
    <ScrollView style={[styles.container, {height}]}>
      {!places && !isEmpty ? (
        <>
          <Spacer />
          <View style={styles.header}>
            <Text style={styles.recent}>{t('mapMarking.recent')}</Text>
          </View>
        </>
      ) : null}
      {(places || recentPlaces)?.map((place, index) => {
        let isLast = false;

        if (places) {
          isLast = index === places.length - 1;
        }
        if (!places && recentPlaces) {
          isLast = index === recentPlaces.length - 1;
        }

        return (
          <PlaceItem
            key={`${place.id}-${place.geometry}${place.text}-${index}`}
            place={place}
            onLocate={() => onLocate(place)}
            isLast={isLast}
            isRecent={!places && !!recentPlaces}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    overflow: 'scroll',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
