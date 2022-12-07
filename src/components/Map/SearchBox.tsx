import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Modal, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import {useDebounce} from 'utilities/hooks/useDebounce';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {TPlace} from 'components/Map/types';
import {PlacesList} from 'components/Map/PlacesList';
import {useRecentPlaces} from 'ranger-redux/modules/recentPlaces/recentPlaces';
import {useSearchPlaces} from 'ranger-redux/modules/searchPlaces/searchPlaces';

export type TSearchBoxProps = {
  onLocate: (coordinates: number[]) => void;
  userLocation?: TUserLocation | null;
};

export function SearchBox(props: TSearchBoxProps) {
  const {onLocate, userLocation} = props;

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const {searchPlaces, loading, dispatchResetSearchPlaces, dispatchSearchPlaces} = useSearchPlaces();
  const {recentPlaces, dispatchAddNewPlace} = useRecentPlaces();

  const searchRef = useRef<TextInput>(null);

  const {t} = useTranslation();

  useEffect(() => {
    if (!search) {
      dispatchResetSearchPlaces();
    }
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      (async () => {
        dispatchSearchPlaces(debouncedSearch);
      })();
    } else {
      dispatchResetSearchPlaces();
    }
  }, [dispatchResetSearchPlaces, dispatchSearchPlaces, debouncedSearch]);

  const handleBlur = useCallback(() => {
    setIsFocus(false);
    searchRef?.current?.blur();
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocus(true);
    setTimeout(() => {
      searchRef?.current?.focus();
    }, 200);
  }, []);

  const handleClose = useCallback(
    (toClose: boolean = true) => {
      if (toClose) {
        handleBlur();
      }
      setSearch('');
      dispatchResetSearchPlaces();
    },
    [dispatchResetSearchPlaces, handleBlur],
  );

  const handleSelectPlace = useCallback(
    (place: TPlace) => {
      setIsFocus(false);
      dispatchResetSearchPlaces();
      setSearch('');
      onLocate(place.geometry.coordinates);
      dispatchAddNewPlace(place);
    },
    [onLocate, dispatchResetSearchPlaces, dispatchAddNewPlace],
  );

  const SearchWrapper = useMemo(() => (isFocus ? Modal : React.Fragment), [isFocus]);
  const searchWrapperProps = useMemo(
    () =>
      isFocus
        ? {
            onShow: handleFocus,
            onRequestClose: handleBlur,
            transparent: true,
          }
        : {},
    [handleBlur, handleFocus, isFocus],
  );

  const placesHeight = Dimensions.get('screen').height - 270;

  const showPlaces = useMemo(() => {
    return ((!!searchPlaces && searchPlaces?.length > 0) || (!!recentPlaces && recentPlaces?.length > 0)) && isFocus;
  }, [isFocus, searchPlaces, recentPlaces]);

  const isEmptyResult = useMemo(
    () => !loading && !searchPlaces?.length && !!debouncedSearch && !!search && isFocus,
    [debouncedSearch, isFocus, loading, searchPlaces?.length, search],
  );

  return (
    <SearchWrapper {...searchWrapperProps}>
      <View style={[styles.container, isFocus && styles.focusedContainer]}>
        <View style={[styles.searchBox, isEmptyResult && styles.empty]}>
          <TouchableOpacity onPress={handleFocus} style={styles.inputWrapper} activeOpacity={1}>
            {isFocus ? (
              <TouchableOpacity onPress={() => handleClose(true)}>
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
              value={search}
              onChangeText={setSearch}
            />
            <Spacer />
            {loading ? (
              <ActivityIndicator size="small" color={colors.green} />
            ) : (
              !!search && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => handleClose(false)}>
                  <Icon name="close" size={18} color={colors.khaki} />
                </TouchableOpacity>
              )
            )}
          </TouchableOpacity>
          {showPlaces && !isEmptyResult && (
            <>
              <Spacer times={4} />
              <Hr />
              <PlacesList
                userLocation={userLocation}
                height={placesHeight}
                places={searchPlaces || recentPlaces}
                onLocate={handleSelectPlace}
                isRecent={!searchPlaces && !!recentPlaces}
                isEmpty={!loading && !searchPlaces?.length && !!debouncedSearch && !!search}
              />
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
  empty: {
    borderWidth: 2,
    borderColor: colors.red,
    borderStyle: 'solid',
  },
  cancelBtn: {
    backgroundColor: colors.grayDarker,
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
