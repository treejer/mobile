import React, {useCallback, useState} from 'react';
import {ActivityIndicator, RefreshControl, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import BigList, {BigListRenderItemInfo} from 'react-native-big-list';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {useCurrentJourney} from 'services/currentJourney';
import {Hr} from 'components/Common/Hr';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {EmptyModelsList} from 'components/plantModels/EmptyModelsList';
import {PlantModelItem} from 'components/plantModels/PlantModelItem';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {Plus} from 'components/Icons';
import {TreeJourney} from 'screens/TreeSubmission/types';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {GetPlantingModelsQueryQueryPartialData} from 'screens/TreeSubmission/screens/SelectModels/graphql/getPlantingModelsQuery.graphql';
import {PlantModelButtons} from 'screens/TreeSubmission/components/Models/PlantModelButtons';
import {isWeb} from 'utilities/helpers/web';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import useGetPlantModelsQuery from 'utilities/hooks/useGetPlantModelsQuery';
import {Loading} from 'components/AppLoading/Loading';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.SelectModels>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.SelectModels>;

export interface SelectModelsProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

export function SelectModels(props: SelectModelsProps) {
  const {navigation, plantTreePermissions} = props;
  const {showPermissionModal} = plantTreePermissions;

  const [selectedModel, setSelectedModel] = useState<string>('');

  const {journey, setNewJourney, clearJourney} = useCurrentJourney();

  const {
    persistedData: plantModels,
    query: plantModelsQuery,
    refetching: plantModelsRefetching,
    refetchData: refetchPlantModels,
    loadMore: plantModelsLoadMore,
  } = useGetPlantModelsQuery();

  const {t} = useTranslation();

  useRefocusEffect(() => {
    clearJourney();
    (async () => {
      await refetchPlantModels();
    })();
  });

  const handleContinueToPlant = useCallback(
    (nurseryCount: string, single: boolean = false) => {
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
    [selectedModel],
  );

  const handleNavigateToCreateModel = useCallback(() => {
    navigation.navigate(Routes.CreateModel);
  }, []);

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

  const renderPlantModelItem = useCallback(
    ({item, index}: BigListRenderItemInfo<GetPlantingModelsQueryQueryPartialData.Models>) => {
      const isSelected = item.id === selectedModel;
      return (
        <View
          style={[{justifyContent: 'center', alignItems: 'center', height: isWeb() ? 68 : 73}, globalStyles.screenView]}
        >
          <PlantModelItem model={item} isSelected={isSelected} onSelect={() => setSelectedModel(item.id as string)} />
          {plantModels && plantModels?.length - 1 !== index && <Hr styles={{marginTop: 8, width: 360}} />}
        </View>
      );
    },
    [selectedModel, plantModels],
  );

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <Loading loading={plantModelsQuery.loading || plantModelsRefetching} container>
        <ScreenTitle
          goBack
          title={t('selectModels.title')}
          rightContent={<Plus color={colors.black} onPress={handleNavigateToCreateModel} />}
        />
        <View style={[globalStyles.fill, globalStyles.alignItemsCenter]}>
          {!plantModelsQuery.loading && (
            <PullToRefresh onRefresh={refetchPlantModels}>
              <View style={globalStyles.screenView}>
                <BigList<GetPlantingModelsQueryQueryPartialData.Models>
                  refreshing
                  style={{flex: 1, width: '100%'}}
                  data={plantModels || undefined}
                  renderItem={renderPlantModelItem}
                  showsVerticalScrollIndicator={false}
                  itemHeight={isWeb() ? 68 : 73}
                  contentContainerStyle={[styles.list, plantModels && !plantModels.length && styles.emptyList]}
                  ListEmptyComponent={() => <EmptyModelsList />}
                  keyExtractor={item => item.id?.toString() as string}
                  onRefresh={refetchPlantModels}
                  onEndReachedThreshold={0.1}
                  onEndReached={plantModelsLoadMore}
                  refreshControl={
                    isWeb() ? undefined : (
                      <RefreshControl refreshing={plantModelsRefetching} onRefresh={refetchPlantModels} />
                    )
                  }
                />
              </View>
            </PullToRefresh>
          )}
        </View>
        {!plantModelsQuery.loading && (
          <PlantModelButtons
            selectedModel={!!selectedModel}
            modelExist={!!plantModels?.length}
            onPlant={handleContinueToPlant}
          />
        )}
      </Loading>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
});
