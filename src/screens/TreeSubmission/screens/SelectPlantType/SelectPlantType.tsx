import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useCurrentJourney} from 'services/currentJourney';
import {isNumber} from 'utilities/helpers/validators';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import Button from 'components/Button/Button';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {StartPlantButton} from 'components/StartPlantButton/StartPlantButton';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useConfig} from 'ranger-redux/modules/web3/web3';

export type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;
export type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;

export interface SelectPlantTypeProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
}

export default function SelectPlantType(props: SelectPlantTypeProps) {
  const {navigation} = props;

  console.log(navigation);

  const {journey, setNewJourney, clearJourney} = useCurrentJourney();
  const inputRef = useRef<TextInput>(null);
  const {t} = useTranslation();

  const [isSingle, setIsSingle] = useState<boolean | null>(null);
  const [byModel, setByModel] = useState<boolean>(false);
  const [count, setCount] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const {isMainnet} = useConfig();
  const {changeCheckMetaData} = useSettings();

  const isConnected = useNetInfoConnected();

  useRefocusEffect(() => {
    clearJourney();
    setCount('');
    if (isMainnet) {
      changeCheckMetaData(true);
    }
  });

  const handleStart = useCallback(
    (single: boolean | null, nurseryCount: string) => {
      let newJourney;
      if (Number(nurseryCount) <= 1) {
        newJourney = {
          ...journey,
          isSingle: true,
        };
      } else {
        newJourney = {
          ...journey,
          isSingle: single,
          nurseryCount: Number(nurseryCount),
        };
      }
      navigation.navigate(Routes.SelectPhoto);
      setNewJourney(newJourney);
    },
    [navigation, setNewJourney, journey],
  );

  const handleSelectNursery = useCallback(() => {
    setIsSingle(false);
    setByModel(false);
    inputRef?.current?.focus();
  }, []);

  const handleSelectSingle = useCallback(() => {
    setByModel(false);
    setIsSingle(true);
    handleStart(true, count);
    inputRef?.current?.blur();
  }, [count, handleStart]);

  const handleSelectModels = useCallback(() => {
    setByModel(true);
    setIsSingle(null);
    navigation.navigate(Routes.SelectModels);
    inputRef?.current?.blur();
  }, [navigation]);

  const handleFocus = () => {
    setByModel(false);
    setIsSingle(false);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeNurseryCount = value => {
    if (isNumber(value)) {
      setCount(value);
    }
  };

  const singleColor = useMemo(() => (isSingle ? colors.green : colors.grayLight), [isSingle]);
  const modelColor = useMemo(() => (byModel ? colors.green : colors.grayLight), [byModel]);
  const nurseryColor = useMemo(
    () => (isSingle === null ? colors.grayLight : isSingle === false ? colors.green : colors.grayLight),
    [isSingle],
  );
  const nurseryPlaceholder = useMemo(
    () => (isFocused ? 'submitTree.focusedNursery' : 'submitTree.nursery'),
    [isFocused],
  );

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill, styles.container]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <StartPlantButton
        testID="single-tree-btn-cpt"
        caption={t('submitTree.singleTree')}
        onPress={handleSelectSingle}
        color={singleColor}
        size="lg"
        type="single"
      />
      <StartPlantButton
        testID="nursery-btn-cpt"
        placeholder={t(nurseryPlaceholder)}
        onPress={handleSelectNursery}
        color={nurseryColor}
        count={count}
        inputRef={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeNurseryCount}
        size="lg"
        type="nursery"
      />
      {/*<StartPlantButton*/}
      {/*  caption={t('submitTree.models')}*/}
      {/*  onPress={handleSelectModels}*/}
      {/*  color={modelColor}*/}
      {/*  size="lg"*/}
      {/*  type="model"*/}
      {/*/>*/}
      {isSingle === true && (
        <Button
          testID="single-submit-tree"
          variant="secondary"
          caption={t('submitTree.startToPlant')}
          onPress={() => handleStart(isSingle, count)}
        />
      )}
      {isSingle === false && count ? (
        <Button
          testID="nursery-submit-tree"
          variant="secondary"
          caption={t('submitTree.startToPlantNursery', {count: Number(count)})}
          onPress={() => handleStart(isSingle, count)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
