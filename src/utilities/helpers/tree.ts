import {ImageSourcePropType} from 'react-native';
import {Tree} from 'types';

import treeImage from '../../../assets/icons/tree.png';
import {Hex2Dec} from 'utilities/helpers/hex';
import {colors} from 'constants/values';
import {currentTimestamp} from 'utilities/helpers/date';
import humanize from 'humanize-duration';

export function treeImageSrc(tree: Tree): ImageSourcePropType {
  const imageFs = tree?.treeSpecsEntity?.imageFs;
  return imageFs ? {uri: imageFs} : treeImage;
}

export function treeColor(tree: Tree, treeUpdateInterval: number): string {
  const id = Number(Hex2Dec(tree?.id));
  let color: string;
  if (id >= 0 && id <= 10) {
    color = colors.claimable;
  } else if (id >= 11 && id <= 100) {
    color = colors.pink;
  } else {
    color = colors.claimed;
  }
  if (tree?.treeStatus?.toString() === '3') {
    color = colors.yellow;
    return color;
  } else if (isUpdatePended(tree)) {
    color = colors.pink;
    return color;
  } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
    color = colors.gray;
  }

  return color || colors.green;
}

export function isUpdatePended(tree: Tree): boolean {
  return tree?.lastUpdate?.updateStatus?.toString() === '1';
}

export function diffUpdateTime(tree: Tree, treeUpdateInterval: number | string): number {
  const differUpdateTime = Number(tree?.plantDate) + Number(tree?.treeStatus * 3600 + Number(treeUpdateInterval));
  return currentTimestamp() - differUpdateTime;
  // if (return < 0) {Last update is pending} else {can update}
}

export function isTheTimeToUpdate(tree: Tree, treeUpdateInterval: number | string): boolean {
  return diffUpdateTime(tree, treeUpdateInterval) >= 0;
}

export function treeDiffUpdateHumanized(diff: number, language = 'en') {
  return humanize(diff * 1000, {language});
}
