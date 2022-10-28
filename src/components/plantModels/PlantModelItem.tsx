import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

import {colors} from 'constants/values';
import {Hex2Dec} from 'utilities/helpers/hex';
import {capitalize} from 'utilities/helpers/capitalize';
import Spacer from 'components/Spacer';
import {GetPlantingModelsQueryQueryData} from 'screens/TreeSubmission/screens/SelectModels/graphql/getPlantingModelsQuery.graphql';
import {useWalletWeb3} from '../../redux/modules/web3/web3';
import {useCountries} from '../../redux/modules/countris/countries';
import {TreeImage} from '../../../assets/icons';

export type TPlantModel = Omit<GetPlantingModelsQueryQueryData.Models, '__typename'>;

export type TPlantModelItemProps = {
  model: TPlantModel;
  isSelected: boolean;
  onSelect: () => void;
};

export function PlantModelItem(props: TPlantModelItemProps) {
  const {model, isSelected, onSelect} = props;
  const web3 = useWalletWeb3();
  const {countries} = useCountries();

  const updatedAt = moment(model.updatedAt * 1000).format('lll');

  const country = useMemo(
    () => countries?.find(country => country.numcode === model.country)?.name,
    [model, countries],
  );

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.row, styles.container, isSelected ? styles.selectedModel : styles.notSelectedModal]}
    >
      <Image source={TreeImage} style={styles.avatar} />
      <View style={styles.details}>
        <View>
          <Text style={styles.title}>
            {Hex2Dec(model.id)} {country ? capitalize(country) : null}
          </Text>
          <Spacer times={1} />
          <Text style={styles.date}>{updatedAt}</Text>
        </View>
        <Text style={styles.price}>${web3.utils.fromWei(model.price.toString())}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
