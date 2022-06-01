import React from 'react';
import globalStyles from 'constants/styles';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {TreeImage} from './TreeImage';
import {Hex2Dec} from 'utilities/helpers/hex';
import {Tree} from 'types';

interface TreeSymbolPropsType {
  handlePress?: () => void;
  tree?: Tree;
  color?: string;
  size?: number;
  treeUpdateInterval: number;
  style?: object;
  tint?: boolean;
  autoHeight?: boolean;
  hideId?: boolean;
}
const TreeSymbol = (props: TreeSymbolPropsType) => {
  const {handlePress, tree, color, size = 60, treeUpdateInterval, style, autoHeight, tint = true, hideId} = props;

  return (
    <TouchableOpacity
      style={[{height: autoHeight ? undefined : 80, marginBottom: autoHeight ? 0 : 15}, styles.tree]}
      onPress={handlePress}
    >
      <TreeImage
        tree={tree}
        size={size}
        tint={tint}
        style={style}
        color={color}
        treeUpdateInterval={treeUpdateInterval}
      />
      {!hideId && (
        <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{Hex2Dec(tree?.id!)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default TreeSymbol;

const styles = StyleSheet.create({
  tree: {
    width: 52,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  treeName: {
    fontWeight: '700',
    fontSize: 12,
  },
});
