import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, Modal, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';

export function SearchBox() {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [hasResult, setHasResult] = useState('');

  const searchRef = useRef<TextInput>(null);

  const resultHeight = Dimensions.get('screen').height - 270;

  const {t} = useTranslation();

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
    setHasResult('');
  }, [handleBlur]);

  const SearchWrapper = isFocus ? Modal : React.Fragment;
  const searchWrapperProps = isFocus
    ? {
        onShow: handleFocus,
        onRequestClose: handleBlur,
        transparent: true,
        animated: true,
      }
    : {};

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
              onBlur={handleBlur}
              onFocus={() => setIsFocus(true)}
              onChangeText={setHasResult}
            />
          </TouchableOpacity>
          {!!hasResult && isFocus && (
            <>
              <Spacer times={4} />
              <Hr />
              <View style={{height: resultHeight}} />
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
    paddingVertical: 0,
    fontSize: 14,
    color: colors.grayLight,
  },
});
