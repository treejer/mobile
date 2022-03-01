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

  const handleSelectPhoto = useCallback(async () => {
    const selectedPhoto = await openCameraHook();
    console.log(selectedPhoto);
    if (selectedPhoto.path) {
      const newJourney = {
        ...(journey ?? {}),
        photo: selectedPhoto,
      };

      if (isUpdate && !isConnected) {
        const updatedTree = persistedPlantedTrees.find(item => item.id === journey.treeIdToUpdate);
        dispatchAddOfflineUpdateTree({
          ...newJourney,
          ...updatedTree,
        });
        Alert.alert(t('treeInventory.updateTitle'), t('submitWhenOnline'));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Profile'}],
          }),
        );
        navigation.navigate('GreenBlock', {filter: TreeFilter.OfflineUpdate});
      } else {
        if (isUpdate && isNursery) {
          setPhoto(selectedPhoto);
        } else if (isUpdate && !isNursery) {
          navigation.navigate('SubmitTree', {
            journey: newJourney,
          });
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
  }, [
    openCameraHook,
    journey,
    isUpdate,
    isConnected,
    persistedPlantedTrees,
    dispatchAddOfflineUpdateTree,
    t,
    navigation,
    isNursery,
  ]);

  const handleContinue = useCallback(() => {
    navigation.navigate('SubmitTree', {
      journey: {
        ...journey,
        photo,
      },
    });
  }, [journey, navigation, photo]);

  const handleUpdateLocation = useCallback(() => {
    navigation.navigate('Profile', {
      screen: 'MainProfile',
      params: {
        screen: 'SelectOnMap',
        params: {
          journey: {
            ...journey,
            photo,
          },
        },
      },
    });
  }, [journey, navigation, photo]);

  if (canPlant === false) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
        <Text style={{textAlign: 'center', fontSize: 18}}>{t('supplyCapReached')}</Text>
      </View>
    );
  }

  // @here
  const canUpdate = photo && journey?.tree?.treeSpecsEntity?.locations?.length >= 1;
  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />

        <TreeSubmissionStepper
          isUpdate={isUpdate}
          currentStep={canUpdate ? 2 : 1}
          isSingle={journey?.isSingle}
          count={journey?.nurseryCount}
          isNursery={isNursery}
        >
          <Spacer times={4} />
          {/* @here */}
          {canUpdate ? (
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
