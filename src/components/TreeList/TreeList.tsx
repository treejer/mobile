import React, {useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {
  onSelect(index: number): void;
}

function Trees({onSelect}: Props) {
  return (
    <View style={[globalStyles.horizontalStack, globalStyles.flexWrap]}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((key, index) => (
        <TouchableOpacity style={styles.tree} key={key} onPress={() => onSelect(index)}>
          <Image
            style={[styles.treeImage, key > 10 && styles.inactiveTree]}
            source={require('../../../assets/icons/tree.png')}
          />
          <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{key + 10000}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
