import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import {useTranslation} from 'react-i18next';

import {FilterTree} from 'components/Filter/FilterTrees';
import Spacer from 'components/Spacer';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {TreeImage} from '../../../assets/icons';

export type FilterTreeButtonProps<T> = {
  testID?: string;
  tree: FilterTree<T>;
  onPress: () => void;
  isActive: boolean;
};

export function FilterTreeButton<T>(props: FilterTreeButtonProps<T>) {
  const {testID, tree, isActive, onPress} = props;

  const {t} = useTranslation();

  return (
    <View testID={testID} style={styles.container}>
      {/* @ts-ignore */}
      <DropShadow
        testID="drop-shadow"
        style={isActive ? stylesToOneObject([styles.shadow, {shadowColor: tree.color}]) : undefined}
      >
        <TouchableOpacity
          testID="filter-tree-button-image-container"
          onPress={onPress}
          style={[styles.imageContainer, {backgroundColor: `${tree.color}59`}]}
        >
          <Image testID="filter-tree-image" source={TreeImage} style={[styles.treeImage, {tintColor: tree.color}]} />
          <Text testID="filter-tree-count" style={styles.count}>
            {tree.count}
          </Text>
        </TouchableOpacity>
      </DropShadow>
      <Spacer />
      <Text testID="filter-tree-title" style={[styles.title, {color: tree.color}]}>
        {t(tree.title)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5.62,
    elevation: 1,
  },
  imageContainer: {
    overflow: 'visible',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  treeImage: {
    width: 24,
    height: 38,
    position: 'absolute',
    bottom: 10,
  },
  count: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 12,
    fontWeight: '300',
  },
});
