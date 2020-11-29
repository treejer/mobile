import React from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';

import globalStyles from 'constants/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TreesQueryQueryData} from '../../screens/GreenBlock/screens/MyCommunity/graphql/TreesQuery.graphql';

interface Props {
  onSelect(tree: TreesQueryQueryData.TreesTreesData): void;
  loading?: boolean;
  trees?: TreesQueryQueryData.TreesTreesData[];
}

function Trees({onSelect, loading, trees}: Props) {
  if (loading || !trees) {
    return <ActivityIndicator />;
  }

  return (
    <View style={[globalStyles.horizontalStack, globalStyles.flexWrap, styles.wrapper]}>
      {trees.map((tree, index) => (
        <TouchableOpacity style={styles.tree} key={tree.treeId} onPress={() => onSelect(tree)}>
          <Image
            style={[styles.treeImage, tree.fundedDate && styles.inactiveTree]}
            source={require('../../../assets/icons/tree.png')}
          />
          <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{tree.treeId}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
  },
  tree: {
    width: 54,
    height: 74,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  treeImage: {
    width: 54,
    height: 54,
  },
  treeName: {
    fontWeight: '700',
    fontSize: 12,
  },
  inactiveTree: {
    opacity: 0.3,
  },
});

export default Trees;
