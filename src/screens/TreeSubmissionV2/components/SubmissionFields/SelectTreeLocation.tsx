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
  disabled?: boolean;
};

export function SelectTreeLocation(props: SelectTreeLocationProps) {
  const {testID, hasLocation, disabled, onSelect} = props;

  const {t} = useTranslation();

  const imageUrl = getStaticMapboxUrl(
    mapboxPrivateToken,
    hasLocation?.coords?.longitude,
    hasLocation?.coords?.latitude,
    600,
    300,
  );

  const Wrapper = useMemo(() => (hasLocation && imageUrl ? ImageBackground : React.Fragment), [hasLocation, imageUrl]);
  const WrapperProps = useMemo(
    () =>
      hasLocation && imageUrl
        ? {
            testID: 'select-location-image',
            imageStyle: styles.bgStyle,
            source: {
              uri: imageUrl,
              imageStyle: {
                opacity: 0.4,
              },
            },
          }
        : {},
    [hasLocation, imageUrl],
  );

  return (
    <Card testID={testID} style={styles.container}>
      {/*//@ts-ignore*/}
      <Wrapper {...WrapperProps}>
        <View
          testID="select-location-content"
          style={[styles.contentContainer, {backgroundColor: hasLocation ? colors.darkOpacity : colors.khaki}]}
        >
          <View
            testID="select-tree-photo-text-container"
            style={[styles.textContainer, {backgroundColor: hasLocation ? colors.khakiOpacity : 'transparent'}]}
          >
            <Text testID="select-location-title" style={styles.title}>
              {t('submitTreeV2.location')}
            </Text>
            <Spacer times={1} />
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
              style={[styles.button, {backgroundColor: hasLocation ? colors.grayDarkerOpacity : colors.grayDarker}]}
              disabled={disabled || (hasLocation ? !hasLocation?.canUpdate : false)}
              onPress={onSelect}
            >
              <Icon testID="select-location-icon" name="map-marked-alt" color={colors.khaki} size={18} />
              <Spacer times={3} />
              <Text testID="select-location-map" style={styles.btnText}>
                {t('submitTreeV2.map')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: colors.khaki,
    overflow: 'hidden',
    height: 104,
  },
  bgStyle: {
    borderRadius: 10,
    opacity: 0.5,
  },
  textContainer: {
    height: 74,
    minWidth: 178,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    color: colors.grayDarker,
    fontSize: 20,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
    fontSize: 12,
  },
  desc: {
    fontSize: 12,
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
