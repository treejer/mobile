import React, {useCallback, useState} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {Hr} from 'components/Common/Hr';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {PlantModelItem, TPlantModel} from 'components/plantModels/PlantModelItem';
import {TreeImage} from '../../../../../assets/icons';

const staticModels: TPlantModel[] = [
  {
    avatar: TreeImage,
    type: 'Type 1',
    price: '12$',
    details: 'details about this planting model',
    id: '1',
  },
  {
    avatar: TreeImage,
    type: 'Type 2',
    price: '10$',
    details: 'details about this planting model',
    id: '2',
  },
  {
    avatar: TreeImage,
    type: 'Type 3',
    price: '2$',
    details: 'details about this planting model',
    id: '3',
  },
  {
    avatar: TreeImage,
    type: 'Type 4',
    price: '100$',
    details: 'details about this planting model',
    id: '4',
  },
  {
    avatar: TreeImage,
    type: 'Type 5',
    price: '82$',
    details: 'details about this planting model',
    id: '5',
  },
  {
    avatar: TreeImage,
    type: 'Type 6',
    price: '82$',
    details: 'details about this planting model',
    id: '6',
  },
  {
    avatar: TreeImage,
    type: 'Type 7',
    price: '82$',
    details: 'details about this planting model',
    id: '7',
  },
  {
    avatar: TreeImage,
    type: 'Type 8',
    price: '82$',
    details: 'details about this planting model',
    id: '8',
  },
];

export function SelectModels() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const {t} = useTranslation();

  const navigation = useNavigation();

  const handleContinue = useCallback(() => {
    console.log('plant button');
    // @ts-ignore
    // navigation.navigate(Routes.SelectPhoto);
  }, []);

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
        <FlatList<TPlantModel>
          style={{width: '100%'}}
          data={staticModels}
          renderItem={renderPlantModelItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <Hr styles={{marginVertical: 8}} />}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.pHorizontal}>
        <Spacer times={4} />
        {selectedModel ? (
          <Button
            onPress={handleContinue}
            caption={t('selectModels.plant')}
            variant="secondary"
            style={styles.plantBtn}
          />
        ) : (
          <Text style={styles.chooseMessage}>{t('selectModels.choose')}</Text>
        )}
        <Spacer times={4} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  pHorizontal: {
    paddingHorizontal: 16,
  },
  plantBtn: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  chooseMessage: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});
