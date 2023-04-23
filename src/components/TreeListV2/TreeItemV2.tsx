import React, {useMemo} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {Tree} from 'types';
import {mapboxPrivateToken} from 'services/config';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import TreeSymbol from 'components/TreeList/TreeSymbol';
import {RenderIf} from 'components/Common/RenderIf';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {useSettings} from 'ranger-redux/modules/settings/settings';

export type TreeItemV2Props = {
  testID?: string;
  withDetail?: boolean;
  treeUpdateInterval: number;
  tree: Tree;
};

export function TreeItemV2(props: TreeItemV2Props) {
  const {testID, withDetail, tree, treeUpdateInterval} = props;

  const imageFs = tree?.treeSpecsEntity?.imageFs;
  const size = imageFs ? 60 : 40;

  const {t} = useTranslation();
  const {locale} = useSettings();

  const cptSize = useMemo(() => (withDetail ? 'big' : 'small'), [withDetail]);

  const locationImage = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(tree.treeSpecsEntity.longitude) / Math.pow(10, 6),
        Number(tree.treeSpecsEntity.latitude) / Math.pow(10, 6),
        500,
        300,
      ),
    [tree.treeSpecsEntity.longitude, tree.treeSpecsEntity.latitude],
  );

  return (
    <Card testID={testID} style={[styles.bg, styles[`${cptSize}Container`]]}>
      <RenderIf condition={!!withDetail}>
        <Card style={styles.bg}>
          <Image testID="location-image" source={{uri: locationImage}} style={styles.locationImage} />
        </Card>
      </RenderIf>
      <View style={globalStyles.alignItemsCenter}>
        <View style={withDetail ? styles.treeImageContainer : undefined}>
          <TreeSymbol
            testID="tree-symbol-cpt"
            treeUpdateInterval={treeUpdateInterval}
            size={size}
            autoHeight
            horizontal={withDetail}
          />
        </View>
        <RenderIf condition={!!withDetail}>
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
                {moment(Number(tree.lastUpdate.createdAt) * 1000)
                  .locale(locale)
                  .fromNow()}
              </Text>
            </View>
          </View>
        </RenderIf>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.khaki,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  smallContainer: {
    width: 54,
    height: 72,
    borderRadius: 4,
    ...globalStyles.alignItemsCenter,
    ...globalStyles.justifyContentCenter,
  },
  bigContainer: {
    width: 167,
    height: 167,
    borderRadius: 8,
  },
  locationImage: {
    width: 167,
    height: 76,
    borderRadius: 8,
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
});
