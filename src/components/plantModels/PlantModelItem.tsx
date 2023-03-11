import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

import {colors} from 'constants/values';
import {capitalize} from 'utilities/helpers/capitalize';
import Spacer from 'components/Spacer';
import {GetPlantingModelsQueryQueryPartialData} from 'screens/TreeSubmission/screens/SelectModels/graphql/getPlantingModelsQuery.graphql';
import {useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {useCountries} from 'ranger-redux/modules/countris/countries';

export type TPlantModel = GetPlantingModelsQueryQueryPartialData.Models;

export type TPlantModelItemProps = {
  model: TPlantModel;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
};

export function PlantModelItem(props: TPlantModelItemProps) {
  const {model, isSelected, index, onSelect} = props;
  const web3 = useWalletWeb3();
  const {countries} = useCountries();

  const updatedAt = useMemo(() => (model.updatedAt ? moment(model.updatedAt * 1000).format('lll') : null), []);

  const modelPrice = useMemo(() => (model.price ? web3.utils.fromWei(model.price.toString()) : null), []);

  const country = useMemo(
    () => countries?.find(country => country.numcode === model.country)?.name,
    [model, countries],
  );

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.row, styles.container, isSelected ? styles.selectedModel : styles.notSelectedModal]}
    >
      <View style={styles.idContainer}>
        <Text style={styles.id}>{index + 1}</Text>
      </View>
      <Spacer />
      <View style={styles.details}>
        <View>
          <Text style={styles.title}>{country ? capitalize(country) : null}</Text>
          <Spacer times={1} />
          <Text style={styles.date}>{updatedAt}</Text>
        </View>
        <Text style={styles.price}>${modelPrice}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  idContainer: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  id: {
    fontSize: 20,
    color: colors.grayDarker,
  },
  selectedModel: {
    ...colors.smShadow,
  },
  notSelectedModal: {
    backgroundColor: colors.khaki,
  },
  container: {
    backgroundColor: colors.khakiDark,
    padding: 8,
    borderRadius: 10,
    width: 360,
  },
  title: {
    fontSize: 16,
    color: colors.grayDarker,
    justifyContent: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.grayLight,
  },
  price: {
    fontSize: 14,
    color: colors.grayLight,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  row: {
    flexDirection: 'row',
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
