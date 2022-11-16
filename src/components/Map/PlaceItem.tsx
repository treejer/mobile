import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IOIcon from 'react-native-vector-icons/Ionicons';

import {colors} from 'constants/values';
import {isWeb} from 'utilities/helpers/web';
import Spacer from 'components/Spacer';
import {TPlace} from 'components/Map/types';
import {Hr} from 'components/Common/Hr';

export type TPlaceItemProps = {
  place: TPlace;
  onLocate: () => void;
  isLast: boolean;
};

export function PlaceItem(props: TPlaceItemProps) {
  const {place, isLast, onLocate} = props;

  return (
    <>
      <TouchableOpacity onPress={onLocate} style={styles.placeItem}>
        <IOIcon name="ios-location-outline" size={32} />
        <Spacer />
        <View style={{paddingHorizontal: 4}}>
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
    maxWidth: isWeb() ? undefined : 250,
  },
});
