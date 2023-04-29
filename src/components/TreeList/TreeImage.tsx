import React from 'react';
import {ActivityIndicator, Image, ImageProps, View} from 'react-native';

import {Tree, TreeInList} from 'types';
import {treeColor, treeImageSrc} from 'utilities/helpers/tree';
import TreeSvg from 'components/Icons/Tree';
import {treeColorV2} from 'utilities/helpers/treeColorsV2';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {PlanterTreesQueryQueryPartialData} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import Trees = PlanterTreesQueryQueryPartialData.Trees;

export interface TreeImageProps extends Omit<ImageProps, 'source'> {
  size?: number;
  tree?: Tree | Trees;
  tint?: boolean;
  color?: string;
  isNursery?: boolean;
  treeUpdateInterval: number;
}

export function TreeImage(props: TreeImageProps) {
  const {size = 64, tree, style, tint, color, isNursery, treeUpdateInterval, ...restProps} = props;

  const {useV1Submission} = useConfig();

  const tintColor =
    color ||
    (useV1Submission
      ? treeColor(tree as Tree, treeUpdateInterval)
      : treeColorV2(tree as TreeInList, treeUpdateInterval));

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
      source={treeImageSrc(tree as Tree)}
      {...restProps}
    />
  );
}
