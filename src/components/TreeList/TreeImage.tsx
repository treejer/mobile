import React from 'react';
import {treeColor, treeImageSrc} from 'utilities/helpers/tree';
import {Image, ImageProps, View} from 'react-native';
import {Tree} from 'types';
import {useTreeUpdateInterval} from 'utilities/hooks/treeUpdateInterval';
import TreeSvg from 'components/Icons/Tree';

export interface TreeImageProps extends Omit<ImageProps, 'source'> {
  size?: number;
  tree: Tree;
  tint?: boolean;
  color?: string;
}

export function TreeImage(props: TreeImageProps) {
  const {size = 64, tree, style, tint, color, ...restProps} = props;

  const treeUpdateInterval = useTreeUpdateInterval();
  const tintColor = color || treeColor(tree, treeUpdateInterval);

  if (tree.treeSpecsEntity?.nursery === 'true') {
    return (
      <View style={{alignItems: 'center', marginBottom: 3}}>
        <View style={{flexDirection: 'row'}}>
          <TreeSvg color={tintColor} size={size / 2.1} />
          <TreeSvg color={tintColor} size={size / 2.1} />
        </View>
        <TreeSvg color={tintColor} size={size / 2.1} />
      </View>
    );
  }

  return (
    <Image
      style={[{width: size, height: size, tintColor: tint ? tintColor : undefined}, style]}
      source={treeImageSrc(tree)}
      {...restProps}
    />
  );
}
