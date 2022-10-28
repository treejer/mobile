import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {isWeb} from 'utilities/helpers/web';
import {isNumber} from 'utilities/helpers/validators';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {TreeImage} from '../../../../../assets/icons';

export type TPlantModelButtonsProps = {
  selectedModel: boolean;
  modelExist: boolean;
  onPlant: (nurseryCount: string, single?: boolean) => void;
};

export function PlantModelButtons(props: TPlantModelButtonsProps) {
  const {modelExist, selectedModel, onPlant} = props;

  const [isNursery, setIsNursery] = useState<boolean>(false);
  const [nurseryCount, setNurseryCount] = useState<string>('');

  const navigation = useNavigation<NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectModels>>();
  const {t} = useTranslation();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isNursery) {
      inputRef.current?.focus();
    }
  }, [isNursery]);

  useRefocusEffect(() => {
    setNurseryCount('');
  });

  const handleSelectNursery = useCallback(() => {
    setIsNursery(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsNursery(false);
    inputRef.current?.blur();
  }, []);

  const handleChangeNurseryCount = useCallback(value => {
    if (isNumber(value)) {
      setNurseryCount(value);
    }
  }, []);

  const handleNavigateToCreateModel = useCallback(() => {
    navigation.navigate(Routes.CreateModel);
  }, []);

  return (
    <View style={[globalStyles.alignItemsCenter, isNursery && !isWeb() && {flex: 1}]}>
      <View style={styles.btnContainer}>
        <Spacer times={4} />
        {/*<TouchableOpacity style={[{borderColor: colors.green}, styles.plantType]}>*/}
        {/*  <Image source={TreeImage} style={{height: 56, width: 48, tintColor: colors.green}} />*/}
        {/*  <View style={{flex: 1, paddingHorizontal: 16}}>*/}
        {/*    <Text style={[styles.text, {color: colors.green}]}>{t('submitTree.singleTree')}</Text>*/}
        {/*  </View>*/}
        {/*</TouchableOpacity>*/}
        {selectedModel ? (
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() => onPlant(nurseryCount, true)}
              caption={t('selectModels.tree')}
              variant="secondary"
              style={styles.plantBtn}
            />
            <Spacer />
            <TouchableOpacity
              onPress={handleSelectNursery}
              style={[!isNursery && !nurseryCount ? styles.darkBtn : styles.nurseryBtn, styles.plantBtn]}
            >
              {!isNursery && !nurseryCount ? (
                <Text style={styles.whiteText}>{t('selectModels.nursery')}</Text>
              ) : (
                <TextInput
                  ref={inputRef}
                  placeholderTextColor={colors.green}
                  placeholder={t('selectModels.focusedNursery')}
                  style={[styles.text, styles.nurseryInput]}
                  onFocus={handleSelectNursery}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  value={nurseryCount}
                  onChangeText={handleChangeNurseryCount}
                  returnKeyType="done"
                />
              )}
            </TouchableOpacity>
          </View>
        ) : modelExist ? (
          <Text style={styles.chooseMessage}>{t('selectModels.choose')}</Text>
        ) : null}
        <Spacer />
        <Button
          caption={isNursery || !!nurseryCount ? t('selectModels.nursery') : t('selectModels.create')}
          variant="primary"
          onPress={isNursery || !!nurseryCount ? () => onPlant(nurseryCount) : handleNavigateToCreateModel}
          style={styles.createBtn}
        />
        <Spacer times={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteText: {
    color: colors.white,
  },
  plantType: {
    backgroundColor: colors.khakiDark,
    alignSelf: 'stretch',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 20,
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  btnContainer: {
    width: 360,
  },
  createBtn: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  darkBtn: {
    backgroundColor: colors.grayDarker,
  },
  plantBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  nurseryBtn: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.green,
  },
  text: {
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
    color: colors.green,
  },
  nurseryInput: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chooseMessage: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});
