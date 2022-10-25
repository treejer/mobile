import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {useCurrentJourney} from 'services/currentJourney';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {Hr} from 'components/Common/Hr';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {EmptyModelsList} from 'components/plantModels/EmptyModelsList';
import {PlantModelItem, TPlantModel} from 'components/plantModels/PlantModelItem';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {isWeb} from 'utilities/helpers/web';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import useGetPlantModelsQuery from 'utilities/hooks/useGetPlantModelsQuery';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectModels>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.SelectModels>;

export interface SelectModelsProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

export function SelectModels(props: SelectModelsProps) {
  const {navigation} = props;

  const [isNursery, setIsNursery] = useState<boolean>(false);
  const [nurseryCount, setNurseryCount] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const wallet = useWalletAccount();
  const {journey, setNewJourney, clearJourney} = useCurrentJourney();

  const {data, loading, refetching, refetchPlantModels} = useGetPlantModelsQuery(wallet);

  const {t} = useTranslation();

  useEffect(() => {
    if (isNursery) {
      inputRef.current?.focus();
    }
  }, [isNursery]);

  useRefocusEffect(() => {
    clearJourney();
    setNurseryCount('');
    (async () => {
      await refetchPlantModels();
    })();
  });

  const handleSelectNursery = useCallback(() => {
    setIsNursery(true);
  }, []);

  const handleFocus = useCallback(() => {
    setIsNursery(true);
  }, []);

  const handleBlur = () => {
    setIsNursery(false);
    inputRef.current?.blur();
  };

  const handleNavigateToCreateModel = useCallback(() => {
    navigation.navigate(Routes.CreateModel);
  }, []);

  const handleContinueToPlant = useCallback(
    (single: boolean = false) => {
      console.log('plant button');
      let newJourney: TreeJourney;
      if (single || Number(nurseryCount) <= 1) {
        newJourney = {
          ...journey,
          isSingle: true,
          plantingModel: selectedModel,
        };
      } else {
        newJourney = {
          ...journey,
          isSingle: false,
          nurseryCount: Number(nurseryCount),
          plantingModel: selectedModel,
        };
      }
      setNewJourney(newJourney);
      navigation.navigate(Routes.SelectPhoto);
    },
    [isNursery, nurseryCount, selectedModel],
  );

  const renderPlantModelItem = useCallback(
    ({item}: ListRenderItemInfo<TPlantModel>) => {
      const isSelected = item.id === selectedModel;
      return <PlantModelItem model={item} isSelected={isSelected} onSelect={() => setSelectedModel(item.id)} />;
    },
    [selectedModel],
  );

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle goBack title={t('selectModels.title')} />
      <View style={[globalStyles.fill, globalStyles.alignItemsCenter]}>
        {loading ? (
          <View style={[globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <PullToRefresh onRefresh={refetchPlantModels}>
            <FlatList<TPlantModel>
              style={{width: '100%', backgroundColor: colors.khaki}}
              data={data?.models}
              renderItem={renderPlantModelItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.list, (!data?.models || !data.models?.length) && styles.emptyList]}
              ItemSeparatorComponent={() => <Hr styles={{marginVertical: 8}} />}
              ListEmptyComponent={() => <EmptyModelsList />}
              keyExtractor={item => item.id}
              refreshing
              onRefresh={refetchPlantModels}
              refreshControl={
                isWeb() ? undefined : <RefreshControl refreshing={refetching} onRefresh={refetchPlantModels} />
              }
            />
          </PullToRefresh>
        )}
      </View>
      {!loading && (
        <View style={[globalStyles.alignItemsCenter, isNursery && {flex: 1}]}>
          <View style={styles.btnContainer}>
            <Spacer times={4} />
            {selectedModel ? (
              <View style={{flexDirection: 'row'}}>
                {!isNursery && (
                  <>
                    <Button
                      onPress={() => handleContinueToPlant(true)}
                      caption={t('selectModels.tree')}
                      variant="secondary"
                      style={styles.plantBtn}
                    />
                    <Spacer />
                  </>
                )}
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
                      placeholder={t('submitTree.focusedNursery')}
                      style={[styles.text, styles.nurseryInput]}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      keyboardType="number-pad"
                      value={nurseryCount}
                      onChangeText={setNurseryCount}
                      returnKeyType="done"
                    />
                  )}
                </TouchableOpacity>
              </View>
            ) : data?.models?.length ? (
              <Text style={styles.chooseMessage}>{t('selectModels.choose')}</Text>
            ) : null}
            <Spacer />
            <Button
              caption={isNursery || !!nurseryCount ? t('selectModels.nursery') : t('selectModels.create')}
              variant="primary"
              onPress={isNursery || !!nurseryCount ? () => handleContinueToPlant() : handleNavigateToCreateModel}
              style={styles.createBtn}
            />
            <Spacer times={10} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  whiteText: {
    color: colors.white,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  pHorizontal: {
    paddingHorizontal: 16,
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
    ...globalStyles.h6,
    width: '100%',
    textAlign: 'center',
    color: colors.green,
  },
  nurseryInput: {
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
