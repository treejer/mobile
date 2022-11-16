import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, Modal, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import {mapboxPublicToken} from 'services/config';
import {colors} from 'constants/values';
import {useDebounce} from 'utilities/hooks/useDebounce';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {TPlace} from 'components/Map/types';
import {PlacesList} from 'components/Map/PlacesList';

export type TSearchBoxProps = {
  onLocate: (coordinates: number[]) => void;
};

export function SearchBox(props: TSearchBoxProps) {
  const {onLocate} = props;

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [places, setPlaces] = useState<TPlace[] | null>(null);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);

  const searchRef = useRef<TextInput>(null);

  const {t} = useTranslation();

  const handleFetchPlaces = useCallback(async (place: string) => {
    try {
      const {data} = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?proximity=ip&access_token=${mapboxPublicToken}`,
      );
      setPlaces(data.features);
    } catch (e: any) {
      console.log(e, 'error here');
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      (async () => {
        await handleFetchPlaces(debouncedSearch);
      })();
    } else {
      setPlaces(null);
    }
  }, [handleFetchPlaces, debouncedSearch]);

  const handleBlur = useCallback(() => {
    setIsFocus(false);
    searchRef?.current?.blur();
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocus(true);
    setTimeout(() => {
      searchRef?.current?.focus();
    }, 100);
  }, []);

  const handleClose = useCallback(() => {
    handleBlur();
    setPlaces(null);
  }, [handleBlur]);

  const handleSelectPlace = useCallback(
    (coordinates: number[]) => {
      setIsFocus(false);
      onLocate(coordinates);
    },
    [onLocate],
  );

  const SearchWrapper = isFocus ? Modal : React.Fragment;
  const searchWrapperProps = isFocus
    ? {
        onShow: handleFocus,
        onRequestClose: handleBlur,
        transparent: true,
        animated: true,
      }
    : {};

  const placesHeight = Dimensions.get('screen').height - 270;

  return (
    <SearchWrapper {...searchWrapperProps}>
      <View style={[styles.container, isFocus && styles.focusedContainer]}>
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={handleFocus} style={styles.inputWrapper} activeOpacity={1}>
            {isFocus ? (
              <TouchableOpacity onPress={handleClose}>
                <Icon name="chevron-left" size={24} color={colors.grayDarker} />
              </TouchableOpacity>
            ) : (
              <Icon name="search" size={24} color={colors.grayDarker} />
            )}
            <Spacer />
            <TextInput
              editable={isFocus}
              ref={searchRef}
              style={styles.searchInput}
              placeholderTextColor={colors.grayDarker}
              placeholder={t('mapMarking.searchPlaceholder')}
              onFocus={() => setIsFocus(true)}
              onChangeText={setSearch}
            />
          </TouchableOpacity>
          {!!places && places.length > 0 && isFocus && (
            <>
              <Spacer times={4} />
              <Hr />
              <PlacesList height={placesHeight} places={places} onLocate={handleSelectPlace} />
            </>
          )}
        </View>
      </View>
    </SearchWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 999999999999,
  },
  focusedContainer: {
    backgroundColor: colors.loadingOpacity,
    height: '100%',
    maxWidth: 768,
    margin: 'auto',
  },
  searchBox: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.khaki,
    ...colors.smShadow,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: colors.grayLight,
  },
});
