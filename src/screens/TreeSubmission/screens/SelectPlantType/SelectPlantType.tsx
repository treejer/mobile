import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Tree from 'components/Icons/Tree';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button/Button';
import {TreeSubmissionRouteParamList} from 'types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {TreeImage} from '../../../../../assets/icons';
import {Routes} from 'navigation';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.SelectPlantType>;

export interface SelectPlantTypeProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
}

export default function SelectPlantType(props: SelectPlantTypeProps) {
  const {navigation, route} = props;

  const inputRef = useRef<TextInput>(null);
  const {t} = useTranslation();

  const [isSingle, setIsSingle] = useState<boolean | null>(null);
  const [count, setCount] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleStart = useCallback(
    (single: boolean | null, nurseryCount: string) => {
      let newJourney;
      if (Number(nurseryCount) <= 1) {
        newJourney = {
          ...route.params.journey,
          isSingle: true,
        };
      } else {
        newJourney = {
          ...route.params.journey,
          isSingle: single,
          nurseryCount: Number(nurseryCount),
        };
      }
      navigation.navigate(Routes.SelectPhoto, {
        journey: newJourney,
      });
    },
    [navigation, route.params.journey],
  );

  const handleSelectNursery = useCallback(() => {
    setIsSingle(false);
    inputRef?.current?.focus();
  }, []);

  const handleSelectSingle = useCallback(() => {
    setIsSingle(true);
    handleStart(true, count);
    inputRef?.current?.blur();
  }, [count, handleStart]);

  const handleFocus = () => {
    setIsSingle(false);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const singleColor = useMemo(() => (isSingle ? colors.green : colors.grayLight), [isSingle]);
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
      <TouchableOpacity style={[{borderColor: singleColor}, styles.plantType]} onPress={handleSelectSingle}>
        <Image source={TreeImage} style={{height: 56, width: 48, tintColor: singleColor}} />
        <View style={{flex: 1, paddingHorizontal: 16}}>
          <Text style={[styles.text, {color: singleColor}]}>{t('submitTree.singleTree')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[{borderColor: nurseryColor}, styles.plantType]} onPress={handleSelectNursery}>
        <View style={styles.treesWrapper}>
          <View style={styles.trees}>
            <Tree color={nurseryColor} size={24} />
            <Tree color={nurseryColor} size={24} />
          </View>
          <Tree color={nurseryColor} size={24} />
        </View>
        <View style={{flex: 1, paddingHorizontal: 16}}>
          <TextInput
            placeholderTextColor={nurseryColor}
            placeholder={t(nurseryPlaceholder)}
            style={[styles.text, styles.nurseryInput]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={inputRef}
            keyboardType="number-pad"
            value={count?.toString()}
            onChangeText={value => setCount(value)}
            returnKeyType="done"
          />
        </View>
      </TouchableOpacity>
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
  treesWrapper: {
    alignItems: 'center',
  },
  trees: {
    flexDirection: 'row',
  },
  text: {
    ...globalStyles.h5,
  },
  nurseryInput: {
    height: '100%',
  },
});
