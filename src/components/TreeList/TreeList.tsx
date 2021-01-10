import globalStyles from 'constants/styles';

import React from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {Tree} from 'types';

interface Props {
  onSelect(tree: Tree): void;
  loading?: boolean;
  trees?: Tree[];
}

function Trees({onSelect, loading, trees}: Props) {
  const navigation = useNavigation();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!trees || trees.length === 0) {
    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill]}>
        <Spacer times={20} />
        <Text>You haven't planted any trees yet</Text>
        <Spacer times={5} />
        <Button
          caption="Plant your first tree"
          variant="cta"
          onPress={() => {
            navigation.navigate('TreeSubmission');
          }}
        />
      </View>
    );
  }
  return (
    <View style={[globalStyles.horizontalStack, globalStyles.flexWrap, styles.wrapper]}>
      {trees?.map(tree => (
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
  wrapper: {},
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
