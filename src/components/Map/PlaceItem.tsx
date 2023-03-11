import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IOIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {TPlace} from 'components/Map/types';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';

export type TPlaceItemProps = {
  place: TPlace;
  onLocate: () => void;
  isLast: boolean;
  isRecent: boolean;
  userLocation?: TUserLocation | null;
};

export function PlaceItem(props: TPlaceItemProps) {
  const {place, isLast, isRecent, userLocation, onLocate} = props;

  const {t} = useTranslation();

  const distance = calcDistanceInMeters(
    {longitude: place.geometry.coordinates[0], latitude: place.geometry.coordinates[1]},
    {
      latitude: userLocation?.latitude || 0,
      longitude: userLocation?.longitude || 0,
    },
  );

  const distanceInKiloMeters = useMemo(() => distance / 1000, [distance]);

  return (
    <>
      <TouchableOpacity onPress={onLocate} style={styles.placeItem}>
        <View style={[globalStyles.alignItemsCenter, globalStyles.justifyContentCenter, {width: 66}]}>
          {isRecent ? (
            <FAIcon name="clock-o" size={32} color={colors.grayDarker} />
          ) : (
            <IOIcon name="ios-location-outline" size={32} />
          )}
          <Spacer times={0.5} />
          <Text style={styles.distance}>{t('mapMarking.km', {km: Number(distanceInKiloMeters).toFixed(2)})}</Text>
        </View>
        <Spacer />
        <View style={styles.placeDetail}>
          <Text style={styles.placeName}>{place.text}</Text>
          <Spacer times={0.5} />
          <Text style={styles.placeAddress} numberOfLines={4}>
            {place.place_name}
          </Text>
        </View>
      </TouchableOpacity>
      {!isLast && <Hr styles={{width: '100%'}} />}
    </>
  );
}

const styles = StyleSheet.create({
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: 16,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  placeAddress: {
    fontSize: 12,
    color: colors.black,
  },
  placeDetail: {
    flex: 1,
    paddingHorizontal: 4,
  },
  distance: {
    fontSize: 10,
  },
});
