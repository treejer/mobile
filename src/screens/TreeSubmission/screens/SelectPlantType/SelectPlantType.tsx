import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ModelIcon from 'react-native-vector-icons/FontAwesome';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useCurrentJourney} from 'services/currentJourney';
import {isNumber} from 'utilities/helpers/validators';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Button from 'components/Button/Button';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {StartPlantButton} from 'components/StartPlantButton/StartPlantButton';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;

export interface SelectPlantTypeProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

export default function SelectPlantType(props: SelectPlantTypeProps) {
  const {navigation, plantTreePermissions} = props;
  const {showPermissionModal} = plantTreePermissions;

  const {journey, setNewJourney, clearJourney} = useCurrentJourney();
  const inputRef = useRef<TextInput>(null);
  const {t} = useTranslation();

  const [isSingle, setIsSingle] = useState<boolean | null>(null);
  const [byModel, setByModel] = useState<boolean>(false);
  const [count, setCount] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const isConnected = useNetInfoConnected();

  useRefocusEffect(() => {
    clearJourney();
    setCount('');
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
  }, []);

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

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill, styles.container]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <StartPlantButton
        caption={t('submitTree.singleTree')}
        onPress={handleSelectSingle}
        color={singleColor}
        size="lg"
        type="single"
      />
      <StartPlantButton
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
      <StartPlantButton
        caption={t('submitTree.models')}
        onPress={handleSelectModels}
        color={modelColor}
        size="lg"
        type="model"
      />
      {isSingle === true && (
        <Button
          variant="secondary"
          caption={t('submitTree.startToPlant')}
          onPress={() => handleStart(isSingle, count)}
        />
      )}
      {isSingle === false && count ? (
        <Button
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
