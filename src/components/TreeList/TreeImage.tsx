import React from 'react';
import {ActivityIndicator, Image, ImageProps, View} from 'react-native';

import TreeSvg from 'components/Icons/Tree';
import {treeImageSrcV2} from 'utilities/helpers/tree';
import {treeColorV2} from 'utilities/helpers/treeColorsV2';
import {SubmittedTree} from 'webServices/trees/submittedTrees';

export interface TreeImageProps extends Omit<ImageProps, 'source'> {
  size?: number;
  tree?: SubmittedTree;
  tint?: boolean;
  color?: string;
  isNursery?: boolean;
  treeUpdateInterval: number;
}

export function TreeImage(props: TreeImageProps) {
  const {size = 64, tree, style, tint, color, isNursery, treeUpdateInterval, ...restProps} = props;

  const tintColor = color || treeColorV2(tree);

  const nurseryHasLocations = tree?.treeSpecsEntity?.locations?.length;

  if (!treeUpdateInterval) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', height: size}}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if ((!nurseryHasLocations && tree?.treeSpecsEntity?.nursery === 'true') || isNursery) {
    return (
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
          },
          style,
        ]}
      >
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
      style={[{width: size, height: size, tintColor: tint && tintColor ? tintColor : undefined}, style]}
      source={treeImageSrcV2(tree)}
      {...restProps}
    />
  );
}
