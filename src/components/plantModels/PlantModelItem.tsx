import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export type TPlantModel = {
  avatar: any;
  type: string;
  price: string;
  details: string;
  id: string;
};

export type TPlantModelItemProps = {
  model: TPlantModel;
  isSelected: boolean;
  onSelect: () => void;
};

export function PlantModelItem(props: TPlantModelItemProps) {
  const {model, isSelected, onSelect} = props;

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.row, styles.container, isSelected ? styles.selectedModel : styles.notSelectedModal]}
    >
      <Image source={model.avatar} style={styles.avatar} />
      <View style={styles.details}>
        <View>
          <Text style={styles.title}>{model.type}</Text>
          <Spacer times={0.5} />
          <Text style={styles.detailsText}>{model.details}</Text>
        </View>
        <Text style={styles.detailsText}>{model.price}</Text>
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
  detailsText: {
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
