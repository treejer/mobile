import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {NotVerifiedTree, TreeStatus} from 'types';
import {mapboxPrivateToken} from 'services/config';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Tree} from 'components/Icons';
import {RenderIf} from 'components/Common/RenderIf';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {TreeImage} from '../../../assets/icons';
import Icon from 'react-native-vector-icons/AntDesign';

export type NotVerifiedTreeItemProps = {
  testID?: string;
  onPress?: () => void;
  tint?: string;
  withDetail?: boolean;
  tree: NotVerifiedTree;
};

export function NotVerifiedTreeItem<T>(props: NotVerifiedTreeItemProps) {
  const {testID, withDetail, tree, tint, onPress} = props;

  const {t} = useTranslation();
  const {locale} = useSettings();

  const treeSpecs = JSON.parse(tree.treeSpecs);

  const hasLocation = useMemo(
    () => !!(treeSpecs?.location?.latitude && treeSpecs?.location?.longitude),
    [treeSpecs?.location?.latitude, treeSpecs?.location?.longitude],
  );

  const cptSize = useMemo(() => (withDetail ? 'big' : 'small'), [withDetail]);

  const locationImage = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(treeSpecs?.location?.longitude) / Math.pow(10, 6),
        Number(treeSpecs?.location?.latitude) / Math.pow(10, 6),
        200,
        200,
      ),
    [treeSpecs],
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
          style={withDetail ? [styles.treeImageContainer, hasLocation ? styles.centerTreeImage : undefined] : undefined}
        >
          <RenderIf condition={tree?.status === TreeStatus.REJECTED}>
            <Icon
              testID="rejected-icon"
              name="close"
              style={[styles.rejectedIcon, {top: withDetail ? 12 : 5}]}
              size={28}
              color={colors.red}
            />
          </RenderIf>
          {treeSpecs.nursery ? (
            <View testID="nursery-icon" style={styles.treesWrapper}>
              <View style={styles.trees}>
                <Tree color={tint} size={16} />
                <Tree color={tint} size={16} />
              </View>
              <Tree color={tint} size={16} />
            </View>
          ) : (
            <Image
              testID="tree-image"
              source={treeSpecs.image ? {uri: treeSpecs.image} : TreeImage}
              style={[styles.treeImage, {tintColor: !treeSpecs.image ? tint : undefined}]}
            />
          )}
          {withDetail ? <Spacer /> : undefined}
          <Text testID="tree-name" style={styles.treeName}>
            {tree.treeId || tree.nonce}
          </Text>
        </View>
        <RenderIf condition={!!withDetail}>
          <Spacer />
          <View style={styles.textContentContainer}>
            <View style={styles.dateContainer}>
              <Text testID="createdAt-date-text" style={styles.dateText}>
                {t('treeInventoryV2.createdAt')}
              </Text>
              <Text testID="date-text-createdAt" style={styles.dateText}>
                {moment(tree.createdAt).locale(locale).fromNow()}
              </Text>
            </View>
            <Spacer />
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
    position: 'relative',
    marginLeft: -8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  treeImage: {
    width: 38,
    height: 38,
  },
  treesWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  trees: {
    flexDirection: 'row',
  },
  treeName: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  centerTreeImage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  rejectedIcon: {
    position: 'absolute',
    left: 5,
    zIndex: 9999,
  },
});
