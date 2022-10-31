import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, Text, FlatList, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';

import {Routes} from 'navigation';
import Button from 'components/Button';
import {colors} from 'constants/values';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import globalStyles, {fontBold, fontMedium} from 'constants/styles';
import {getAllOfflineMaps, deleteOfflineMap} from 'utilities/helpers/maps';

const SavedAreas = ({navigation}) => {
  const [areas, setAreas] = useState<any>(null);

  const {t} = useTranslation();

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    getAllOfflineMaps().then(offlineMaps => {
      setAreas(offlineMaps);
    });
  };

  const deleteArea = async name => {
    deleteOfflineMap({name}).then(async () => {
      setTimeout(async () => await MapboxGL.offlineManager.deletePack(name), 0);
      loadAreas();
    });
  };

  const onPressAddArea = () => {
    navigation.navigate(Routes.OfflineMap);
  };

  const renderSavedAreaItem = ({item}) => {
    const {areaName, size, name} = item;
    const mb = `${Number(size) / 1000} MB`;

    return (
      <View style={styles.areaContainer}>
        <Text style={styles.subHeadingText}>{areaName}</Text>
        <View style={styles.bottomContainer}>
          <Text style={[styles.subHeadingText, styles.regularText]}>{mb}</Text>
          <Text style={[styles.subHeadingText, styles.redText]} onPress={() => deleteArea(name)}>
            {t('offlineMap.delete')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.khaki}, globalStyles.screenViewBottom]}>
      <ScreenTitle goBack title={t('offlineMap.savedAreas')} />
      <View style={styles.container}>
        <View style={styles.areaListContainer}>
          {areas && areas?.length ? (
            <FlatList data={areas} renderItem={renderSavedAreaItem} keyExtractor={(_, i) => i.toString()} />
          ) : areas && areas?.length === 0 ? (
            <Text style={{alignSelf: 'center', textAlignVertical: 'center', margin: 20}}>
              {t('offlineMap.noOfflineArea')}
            </Text>
          ) : (
            <ActivityIndicator size="large" color={colors.green} />
          )}
        </View>
        <Button
          style={{alignItems: 'center', justifyContent: 'center'}}
          onPress={onPressAddArea}
          caption={t('offlineMap.addArea')}
        />
      </View>
    </SafeAreaView>
  );
};
export default SavedAreas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    backgroundColor: colors.khaki,
  },
  areaContainer: {
    backgroundColor: colors.grayLighter,
    elevation: 2,
    borderWidth: 0,
    marginVertical: 10,
    marginHorizontal: 25,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  areaImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaContentContainer: {
    flex: 1.2,
    justifyContent: 'space-evenly',
    marginHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  areaListContainer: {
    marginHorizontal: -25,
    flex: 1,
  },
  subHeadingText: {
    ...fontBold,
    ...globalStyles.body2,
    color: colors.gray,
    marginVertical: 8,
  },
  redText: {
    color: 'red',
  },
  regularText: {
    ...fontMedium,
  },
  addSpecies: {
    color: colors.red,
    ...fontMedium,
    ...globalStyles.body2,
    textAlign: 'center',
  },
});
