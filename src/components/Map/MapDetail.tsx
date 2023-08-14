import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';

export type TMapDetailProps = {
  testID?: string;
  location: TUserLocation;
  accuracyInMeters;
};

export function MapDetail(props: TMapDetailProps) {
  const {accuracyInMeters, location, testID} = props;

  const {t} = useTranslation();

  const NA = useMemo(() => t('mapMarking.NA'), [t]);

  return (
    <View testID={testID} style={styles.container}>
      <Text style={styles.text}>{t('mapMarking.lat', {lat: location?.latitude || NA})}</Text>
      <Text style={styles.text}>{t('mapMarking.long', {long: location?.longitude || NA})}</Text>
      <Text style={styles.text}>
        {t('mapMarking.acc', {acc: accuracyInMeters ? Number(accuracyInMeters).toFixed(2) : NA})}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.khaki,
    flex: 0.9,
    height: 80,
    padding: 8,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 10,
  },
});
