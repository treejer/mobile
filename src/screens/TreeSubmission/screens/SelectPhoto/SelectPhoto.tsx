import globalStyles from 'constants/styles';

import React, {useCallback, useState} from 'react';
import {CommonActions, NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {View, Text, Alert, ScrollView} from 'react-native';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'types';
import {useCamera} from 'utilities/hooks';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {usePersistedPlantedTrees} from 'utilities/hooks/usePlantedTrees';
import {useWalletAccount} from 'services/web3';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useTranslation} from 'react-i18next';
import {TreeFilter} from 'components/TreeList/TreeList';
import {canUpdateTreeLocation} from 'utilities/helpers/submitTree';
import {Routes} from 'navigation';

interface Props {}

function SelectPhoto(_: Props) {
  const navigation = useNavigation<NavigationProp<TreeSubmissionRouteParamList>>();
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();

  const isConnected = useNetInfoConnected();
  const {t} = useTranslation();

  const {dispatchAddOfflineUpdateTree} = useOfflineTrees();
  const [persistedPlantedTrees] = usePersistedPlantedTrees();

  const [photo, setPhoto] = useState<any>();

  const address = useWalletAccount();

  const {canPlant} = usePlanterStatusQuery(address);

  const {openCameraHook} = useCamera();
  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  // @here
  const canUpdate = canUpdateTreeLocation(journey, isNursery);
  console.log(journey?.tree?.treeSpecsEntity?.locations, 'journey?.tree?.treeSpecsEntity?.locations', isNursery);

  const handleSelectPhoto = useCallback(async () => {
    const selectedPhoto = await openCameraHook();
    console.log(selectedPhoto);
    if (selectedPhoto) {
      if (selectedPhoto.path) {
        const newJourney = {
          ...(journey ?? {}),
          photo: selectedPhoto,
        };

        if (isConnected) {
          if (isUpdate && isNursery && !canUpdate) {
            navigation.navigate(Routes.SubmitTree, {
              journey: {
                ...newJourney,
                nurseryContinuedUpdatingLocation: true,
              },
            });
          } else if (isUpdate && isNursery) {
            setPhoto(selectedPhoto);
          } else if (isUpdate && !isNursery) {
            navigation.navigate(Routes.SubmitTree, {
              journey: newJourney,
            });
          } else if (!isUpdate) {
            navigation.navigate(Routes.SelectOnMap, {
              journey: newJourney,
            });
          }
        } else {
          const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
          if (isUpdate && isNursery && !canUpdate) {
            dispatchAddOfflineUpdateTree({
              ...newJourney,
              tree: updatedTree,
            });
            Alert.alert(t('treeInventory.updateTitle'), t('submitWhenOnline'));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Profile'}],
              }),
            );
            navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineUpdate});
          } else if (isUpdate && isNursery) {
            setPhoto(selectedPhoto);
          } else if (isUpdate && !isNursery) {
            dispatchAddOfflineUpdateTree({
              ...newJourney,
              tree: updatedTree,
            });
            Alert.alert(t('treeInventory.updateTitle'), t('submitWhenOnline'));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Profile'}],
              }),
            );
            navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineUpdate});
          } else if (!isUpdate) {
            navigation.navigate('Profile', {
              screen: 'MainProfile',
              params: {
                screen: 'SelectOnMap',
                params: {
                  journey: newJourney,
                },
              },
            });
          }
        }
      }
    }
  }, [
    openCameraHook,
    journey,
    isConnected,
    isUpdate,
    isNursery,
    canUpdate,
    navigation,
    persistedPlantedTrees,
    dispatchAddOfflineUpdateTree,
    t,
  ]);

  const handleContinue = useCallback(() => {
    console.log(journey, 'journey handleContinue');
    if (isConnected) {
      navigation.navigate(Routes.SubmitTree, {
        journey: {
          ...journey,
          photo,
          nurseryContinuedUpdatingLocation: true,
        },
      });
    } else {
      const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
      dispatchAddOfflineUpdateTree({
        ...journey,
        photo,
        nurseryContinuedUpdatingLocation: true,
        tree: updatedTree,
      });
      Alert.alert(t('treeInventory.updateTitle'), t('submitWhenOnline'));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        }),
      );
      navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineUpdate});
    }
  }, [dispatchAddOfflineUpdateTree, isConnected, journey, navigation, persistedPlantedTrees, photo, t]);

  const handleUpdateLocation = useCallback(() => {
    const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
    navigation.navigate(Routes.SelectOnMap, {
      journey: {
        ...journey,
        photo,
        ...updatedTree,
        tree: updatedTree,
      },
    });
  }, [journey, navigation, persistedPlantedTrees, photo]);

  if (canPlant === false) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
        <Text style={{textAlign: 'center', fontSize: 18}}>{t('supplyCapReached')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />
        <TreeSubmissionStepper
          isUpdate={isUpdate}
          currentStep={canUpdate && photo ? 2 : 1}
          isSingle={journey?.isSingle}
          count={journey?.nurseryCount}
          canUpdateLocation={canUpdate}
        >
          <Spacer times={4} />
          {/* @here */}
          {canUpdate && photo ? (
            <View style={{flexDirection: 'row'}}>
              <Button variant="secondary" onPress={handleUpdateLocation} caption={t('submitTree.update')} />
              <Button
                variant="primary"
                style={{justifyContent: 'center', marginHorizontal: 8}}
                onPress={handleContinue}
                caption={t('submitTree.continue')}
              />
            </View>
          ) : (
            <Button variant="secondary" onPress={handleSelectPhoto} caption={t('openCamera')} />
          )}
        </TreeSubmissionStepper>
      </View>
    </ScrollView>
  );
}

export default SelectPhoto;
