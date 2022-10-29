import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {StartPlantButton} from 'components/StartPlantButton/StartPlantButton';
import {isWeb} from 'utilities/helpers/web';
import {isNumber} from 'utilities/helpers/validators';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';

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
  }, [isNursery, inputRef]);

  const handleChangeNurseryCount = useCallback(value => {
    if (isNumber(value)) {
      setNurseryCount(value);
    }
  }, []);

  const handleNavigateToCreateModel = useCallback(() => {
    navigation.navigate(Routes.CreateModel);
  }, []);

  const nurseryPlaceholder = useMemo(
    () => (isNursery ? 'selectModels.focusedNursery' : 'selectModels.nursery'),
    [isNursery],
  );

  const nurseryColor = useMemo(
    () => (isNursery || nurseryCount ? colors.green : colors.grayLight),
    [isNursery, nurseryCount],
  );

  return (
    <View style={[globalStyles.alignItemsCenter, isNursery && !isWeb() && {flex: 1}]}>
      <View style={styles.btnContainer}>
        <Spacer times={4} />
        {selectedModel ? (
          <View style={{flexDirection: 'row'}}>
            <StartPlantButton
              containerStyle={{flex: 1}}
              caption={t('selectModels.tree')}
              onPress={() => onPlant(nurseryCount, true)}
              color={colors.grayLight}
              size="sm"
              type="single"
            />
            <Spacer />
            <StartPlantButton
              containerStyle={{flex: 1}}
              onPress={handleSelectNursery}
              color={nurseryColor}
              inputRef={inputRef}
              count={nurseryCount}
              onChangeText={handleChangeNurseryCount}
              placeholder={t(nurseryPlaceholder)}
              onBlur={handleBlur}
              onFocus={handleSelectNursery}
              size="sm"
              type="nursery"
            />
          </View>
        ) : modelExist ? (
          <Text style={styles.chooseMessage}>{t('selectModels.choose')}</Text>
        ) : null}
        <Button
          caption={isNursery || !!nurseryCount ? t('selectModels.nursery') : t('selectModels.create')}
          variant="primary"
          onPress={isNursery || !!nurseryCount ? () => onPlant(nurseryCount) : handleNavigateToCreateModel}
          style={styles.createBtn}
          textStyle={{color: colors.grayLight}}
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
  btnContainer: {
    width: 360,
  },
  createBtn: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    color: colors.khakiDark,
    borderColor: colors.grayLight,
  },
  chooseMessage: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});
