import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IOIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {TPlace} from 'components/Map/types';

export type TPlaceItemProps = {
  place: TPlace;
  onLocate: () => void;
  isLast: boolean;
  isRecent: boolean;
};

export function PlaceItem(props: TPlaceItemProps) {
  const {place, isLast, isRecent, onLocate} = props;

  return (
    <>
      <TouchableOpacity onPress={onLocate} style={styles.placeItem}>
        {isRecent ? (
          <FAIcon name="clock-o" size={32} color={colors.grayDarker} />
        ) : (
          <IOIcon name="ios-location-outline" size={32} />
        )}
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
});
