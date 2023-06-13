import React, {useMemo} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {mapboxPrivateToken} from 'services/config';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {SubmittedTree} from 'webServices/trees/submittedTrees';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import TreeSymbol from 'components/TreeList/TreeSymbol';
import {RenderIf} from 'components/Common/RenderIf';
import Spacer from 'components/Spacer';
import {useSettings} from 'ranger-redux/modules/settings/settings';

export type TreeItemV2Props<T> = {
  testID?: string;
  onPress?: () => void;
  withDetail?: boolean;
  treeUpdateInterval: number;
  tree: SubmittedTree;
};

export function SubmittedTreeItemV2<T>(props: TreeItemV2Props<T>) {
  const {testID, withDetail, tree, treeUpdateInterval, onPress} = props;

  const imageFs = tree?.treeSpecsEntity?.imageFs;
  const size = imageFs ? 60 : 38;

  const {t} = useTranslation();
  const {locale} = useSettings();

  const cptSize = useMemo(() => (withDetail ? 'big' : 'small'), [withDetail]);

  const hasLocation = useMemo(
    () => !!(tree?.treeSpecsEntity?.longitude && tree?.treeSpecsEntity?.latitude),
    [tree?.treeSpecsEntity?.longitude, tree?.treeSpecsEntity?.latitude],
  );

  const locationImage = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(tree?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
        Number(tree?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
        200,
        200,
      ),
    [tree?.treeSpecsEntity?.longitude, tree?.treeSpecsEntity?.latitude],
  );

  return (
    <TouchableOpacity testID={testID} style={[styles.bg, styles[`${cptSize}Container`]]} onPress={onPress}>
      <RenderIf condition={!!withDetail && hasLocation}>
        <View style={styles.bg}>
          <Image testID="location-image" style={styles.locationImage} source={{uri: locationImage}} />
        </View>
      </RenderIf>
      <View style={[styles.contentContainer, {justifyContent: withDetail ? 'flex-end' : 'center'}]}>
        <View
          style={
            withDetail ? [styles.treeImageContainer, !hasLocation ? styles.centerTreeImage : undefined] : undefined
          }
        >
          <TreeSymbol
            testID="tree-symbol-cpt"
            treeUpdateInterval={treeUpdateInterval}
            size={size}
            tint
            autoHeight
            tree={tree}
            horizontal={withDetail}
            handlePress={onPress}
          />
        </View>
        <RenderIf condition={!!withDetail}>
          <Spacer />
          <View style={styles.textContentContainer}>
            <View style={styles.dateContainer}>
              <Text testID="plant-date-text" style={styles.dateText}>
                {t('treeInventoryV2.bornDate')}
              </Text>
              <Text testID="plant-date-text-fromNow" style={styles.dateText}>
                {moment(Number(tree.plantDate) * 1000)
                  .locale(locale)
                  .fromNow()}
              </Text>
            </View>
            <Spacer />
            <View style={styles.dateContainer}>
              <Text testID="update-date-text" style={styles.dateText}>
                {t('treeInventoryV2.lastUpdateDate')}
              </Text>
              <Text testID="update-date-text-fromNow" style={styles.dateText}>
                {moment(Number(tree.lastUpdate ? tree.lastUpdate.createdAt : tree.plantDate) * 1000)
                  .locale(locale)
                  .fromNow()}
              </Text>
            </View>
          </View>
        </RenderIf>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.khaki,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  smallContainer: {
    width: 64,
    height: 80,
    borderRadius: 4,
    ...globalStyles.alignItemsCenter,
    ...globalStyles.justifyContentCenter,
    ...colors.smShadow,
  },
  bigContainer: {
    width: 167,
    height: 167,
    borderRadius: 8,
    ...colors.smShadow,
  },
  locationImage: {
    width: 167,
    height: 72,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  textContentContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  dateContainer: {
    ...globalStyles.flexRow,
    ...globalStyles.justifyContentBetween,
    ...globalStyles.alignItemsCenter,
  },
  dateText: {
    fontSize: 10,
    color: colors.tooBlack,
    fontWeight: '300',
  },
  treeImageContainer: {
    marginLeft: -8,
  },
  centerTreeImage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
