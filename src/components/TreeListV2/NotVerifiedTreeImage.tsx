import React from 'react';
import {Image, ImageProps, View} from 'react-native';

import {NotVerifiedTree} from 'types';
import {colors} from 'constants/values';
import TreeSvg from 'components/Icons/Tree';
import {TreeImage} from '../../../assets/icons';

export type NotVerifiedTreeImageProps = {
  testID?: string;
  tree: NotVerifiedTree;
  tint?: boolean;
  tintColor?: string;
  size?: number;
} & Omit<ImageProps, 'source'>;

export function NotVerifiedTreeImage(props: NotVerifiedTreeImageProps) {
  const {testID, tree, tint, tintColor = colors.gray, size = 38, style} = props;

  const treeSpecs = JSON.parse(tree?.treeSpecsJSON);

  if (treeSpecs.nursery) {
    return (
      <View
        testID={testID}
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
      testID={testID}
      style={[{width: size, height: size, tintColor: tint && tintColor ? tintColor : undefined}, style]}
      source={treeSpecs?.image ? {uri: treeSpecs?.image} : TreeImage}
    />
  );
}
