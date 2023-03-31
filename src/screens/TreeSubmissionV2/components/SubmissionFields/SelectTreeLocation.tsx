import React, {useMemo} from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Trans, useTranslation} from 'react-i18next';

import Card from 'components/Card';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {mapboxPrivateToken} from 'services/config';

export type SelectTreeLocationProps = {
  testID?: string;
  hasLocation?: {
    coords: {
      latitude: number;
      longitude: number;
    };
    canUpdate?: boolean;
  };
  onSelect: () => void;
};

export function SelectTreeLocation(props: SelectTreeLocationProps) {
  const {testID, hasLocation, onSelect} = props;

  const {t} = useTranslation();

  const imageUrl = getStaticMapboxUrl(
    mapboxPrivateToken,
    hasLocation?.coords?.longitude,
    hasLocation?.coords?.latitude,
    600,
    300,
  );

  const Wrapper = useMemo(() => (hasLocation && imageUrl ? ImageBackground : React.Fragment), [hasLocation, imageUrl]);

  return (
    //@ts-ignore
    <Wrapper
      {...(hasLocation && imageUrl
        ? {
            testID: 'select-location-image',
            source: {
              uri: imageUrl,
              imageStyle: {
                opacity: 0.4,
              },
            },
          }
        : {})}
    >
      <Card testID={testID} style={[styles.container, {backgroundColor: hasLocation ? 'transparent' : colors.khaki}]}>
        <View>
          <Text testID="select-location-title" style={styles.title}>
            {t('submitTreeV2.location')}
          </Text>
          <Spacer times={3} />
          <Text style={styles.desc}>
            <Trans
              testID="select-location-desc"
              i18nKey={hasLocation ? 'submitTreeV2.SelectOnMapToChange' : 'submitTreeV2.selectOnMap'}
              components={{Map: <Text style={styles.bold} />}}
            />
          </Text>
        </View>
        <Spacer />
        <View>
          <TouchableOpacity
            testID="select-location-button"
            style={styles.button}
            disabled={hasLocation ? !hasLocation?.canUpdate : false}
            onPress={onSelect}
          >
            <Icon testID="select-location-icon" name="map-marked-alt" color={colors.khaki} size={18} />
            <Spacer times={3} />
            <Text testID="select-location-map" style={styles.btnText}>
              {t('submitTreeV2.map')}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 104,
  },
  title: {
    color: colors.grayDarker,
    fontSize: 20,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
    fontSize: 14,
  },
  desc: {
    fontSize: 14,
    color: colors.grayDarker,
  },
  btnText: {
    color: colors.khaki,
  },
  button: {
    backgroundColor: colors.grayDarker,
    borderRadius: 50,
    width: 120,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
