import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import globalStyles from 'constants/styles';
import {Hex2Dec} from 'utilities/helpers/hex';
import {TreeImage} from './TreeImage';
import Spacer from 'components/Spacer';
import {Tree} from 'types';

interface TreeSymbolPropsType {
  horizontal?: boolean;
  testID?: string;
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
  const {
    testID,
    horizontal,
    handlePress,
    tree,
    color,
    size = 60,
    treeUpdateInterval,
    style,
    autoHeight,
    tint = true,
    hideId,
  } = props;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        {height: autoHeight ? undefined : 80, marginBottom: autoHeight ? 0 : 15},
        styles.tree,
        horizontal
          ? [globalStyles.flexRow, globalStyles.alignItemsCenter, {margin: 0, width: undefined, padding: 0}]
          : {},
      ]}
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
      {horizontal ? <Spacer /> : null}
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
