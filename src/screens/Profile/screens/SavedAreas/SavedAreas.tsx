import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, Text, FlatList, ListRenderItemInfo, ImageBackground, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Routes} from 'navigation/index';
import Button from 'components/Button';
import {colors} from 'constants/values';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import globalStyles, {fontBold, fontMedium} from 'constants/styles';
import {TOfflineMapPack, useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {mapboxPrivateToken} from 'services/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spacer from 'components/Spacer';

const SavedAreas = ({navigation}) => {
  const {packs, dispatchDeleteOfflineMap} = useOfflineMap();

  const {t} = useTranslation();

  useEffect(() => {
    console.log(packs, 'packes');
  }, [packs]);

  const handleDeleteArea = async name => {
    dispatchDeleteOfflineMap(name);
  };

  const onPressAddArea = () => {
    navigation.navigate(Routes.OfflineMap);
  };

  const renderSavedAreaItem = ({item}: ListRenderItemInfo<TOfflineMapPack>) => {
    const {areaName, size, name, coords} = item;
    const mb = `${(Number(size) / 1024 / 1024).toFixed(2)} MB`;

    const imageUrl = getStaticMapboxUrl(mapboxPrivateToken, coords[0], coords[1], 600, 300);

    return (
      <ImageBackground source={{uri: imageUrl}} imageStyle={{opacity: 0.4}} style={styles.areaContainer}>
        <Text style={styles.subHeadingText}>{areaName}</Text>
        <View style={styles.bottomContainer}>
          <Text style={[styles.subHeadingText, styles.regularText]}>{mb}</Text>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => handleDeleteArea(name)}>
            <Icon name="trash" color={colors.red} size={24} />
            <Spacer />
            <Text style={[styles.subHeadingText, styles.redText]}>{t('offlineMap.delete')}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.khaki}, globalStyles.screenViewBottom]}>
      <ScreenTitle goBack title={t('offlineMap.savedAreas')} />
      <View style={styles.container}>
        <View style={styles.areaListContainer}>
          <FlatList<TOfflineMapPack>
            data={packs}
            renderItem={renderSavedAreaItem}
            keyExtractor={(_, i) => i.toString()}
            ListEmptyComponent={() => (
              <Text style={{alignSelf: 'center', textAlignVertical: 'center', margin: 20}}>
                {t('offlineMap.noOfflineArea')}
              </Text>
            )}
          />
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
    color: colors.black,
    marginVertical: 8,
  },
  redText: {
    color: colors.red,
  },
  regularText: {
    ...fontMedium,
    color: colors.grayLight,
  },
  addSpecies: {
    color: colors.red,
    ...fontMedium,
    ...globalStyles.body2,
    textAlign: 'center',
  },
});
