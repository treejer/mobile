import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TFunction, useTranslation} from 'react-i18next';
import FIcon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import {useToast} from 'react-native-toast-notifications';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import moment from 'moment';

import {Hr} from 'components/Common/Hr';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {AlertMode} from 'utilities/helpers/alert';
import {wrapUpString} from 'utilities/helpers/shortenedString';
import {Hex2Dec} from 'utilities/helpers/hex';
import {isWeb} from 'utilities/helpers/web';
import {GetUserActivitiesQueryPartialData} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {Tree} from '../../../assets/images';

export enum ActivityStatus {
  PlanterJoined = 'PlanterJoined',
  OrganizationJoined = 'OrganizationJoined',
  PlanterUpdated = 'PlanterUpdated',
  AcceptedByOrganization = 'AcceptedByOrganization',
  RejectedByOrganization = 'RejectedByOrganization',
  OrganizationMemberShareUpdated = 'OrganizationMemberShareUpdated',
  PlanterTotalClaimedUpdated = 'PlanterTotalClaimedUpdated',
  BalanceWithdrew = 'BalanceWithdrew',
  TreePlanted = 'TreePlanted',
  TreeUpdated = 'TreeUpdated',
  TreeAssigned = 'TreeAssigned',
  AssignedTreePlanted = 'AssignedTreePlanted',
  AssignedTreeVerified = 'AssignedTreeVerified',
  AssignedTreeRejected = 'AssignedTreeRejected',
  TreeVerified = 'TreeVerified',
  TreeRejected = 'TreeRejected',
  TreeUpdatedVerified = 'TreeUpdatedVerified',
  TreeUpdateRejected = 'TreeUpdateRejected',
}

export enum ContractTypes {
  DAI = 'dai',
  MATIC = 'matic',
  ETH = 'eth',
}

export type TActivityItemProps = {
  activity: GetUserActivitiesQueryPartialData.AddressHistories;
  isLast: boolean;
};

export function ActivityItem(props: TActivityItemProps) {
  const {activity, isLast} = props;

  const [isOpen, setIsOpen] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    setIsOpen(false);
  }, [props]);

  const AIcon = ActivityStatus.BalanceWithdrew === activity.event ? IIcon : FIcon;

  const iconName = useMemo(() => {
    if (activity.event === ActivityStatus.BalanceWithdrew) {
      return 'md-wallet';
    } else if (
      [ActivityStatus.PlanterJoined, ActivityStatus.OrganizationJoined].includes(activity.event as ActivityStatus)
    ) {
      return 'user-plus';
    } else if (activity.event === ActivityStatus.RejectedByOrganization) {
      return 'user-x';
    } else {
      return 'user';
    }
  }, [activity.event]);

  const date = useMemo(
    () => (activity.createdAt ? moment(+activity.createdAt * 1000).format('lll') : null),
    [activity.createdAt],
  );

  const bgTree = useMemo(
    () => ({
      [ActivityStatus.TreeRejected]: colors.red,
      [ActivityStatus.TreeUpdateRejected]: colors.red,
      [ActivityStatus.AssignedTreeRejected]: colors.red,
      [ActivityStatus.RejectedByOrganization]: colors.red,
      [ActivityStatus.TreePlanted]: colors.yellow,
      [ActivityStatus.AssignedTreePlanted]: colors.yellow,
      [ActivityStatus.TreeUpdated]: colors.pink,
      [ActivityStatus.TreeVerified]: colors.green,
      [ActivityStatus.AssignedTreeVerified]: colors.green,
      [ActivityStatus.TreeUpdatedVerified]: colors.green,
      [ActivityStatus.TreeAssigned]: colors.green,
      [ActivityStatus.RejectedByOrganization]: colors.red,
      gray: colors.gray,
    }),
    [],
  );

  const isRelatedToTree = useMemo(
    () =>
      [
        ActivityStatus.TreePlanted,
        ActivityStatus.TreeUpdated,
        ActivityStatus.TreeVerified,
        ActivityStatus.TreeRejected,
        ActivityStatus.TreeUpdateRejected,
        ActivityStatus.TreeUpdatedVerified,
        ActivityStatus.AssignedTreeVerified,
        ActivityStatus.AssignedTreeRejected,
        ActivityStatus.AssignedTreePlanted,
        ActivityStatus.TreeAssigned,
      ].includes(activity.event as ActivityStatus),
    [activity.event],
  );

  const title = useMemo(() => {
    if (activity.event === ActivityStatus.BalanceWithdrew && activity.count) {
      return t('activities.withdraw', {amount: Number(Hex2Dec(activity.count.toString()).toFixed(6))});
    } else if (isRelatedToTree) {
      if (activity.event === ActivityStatus.TreePlanted) {
        return t('activities.new', {tempId: Hex2Dec(activity.typeId as string)});
      } else {
        return `#${Hex2Dec(activity.typeId as string)}`;
      }
    } else {
      return t(`activities.${activity.event}`);
    }
  }, [activity]);

  const handleOpenDetails = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  return (
    <View style={globalStyles.alignItemsCenter}>
      <Spacer />
      <View style={[styles.container, isOpen && colors.smShadow]}>
        <View style={styles.row}>
          {isRelatedToTree ? (
            <View style={[styles.image, {backgroundColor: bgTree[activity.event as string]}]}>
              <Image source={Tree} style={styles.tree} />
            </View>
          ) : (
            <View
              style={[
                styles.image,
                {backgroundColor: bgTree[activity.event as string] || bgTree.gray, borderRadius: 22},
              ]}
            >
              <AIcon name={iconName} size={22} color={colors.white} />
            </View>
          )}
          <Spacer />
          <View style={[styles.row, styles.detail]}>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Spacer times={0.5} />
              <Text style={styles.date}>{date}</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={handleOpenDetails}>
              <Text style={styles.status}>{t(`activities.${activity.event}`)}</Text>
              <Spacer />
              <FIcon
                style={{marginTop: 4, transform: [{rotate: isOpen ? '180deg' : '0deg'}]}}
                name="chevron-down"
                size={20}
                color={colors.grayLight}
              />
            </TouchableOpacity>
          </View>
        </View>
        {isOpen && (
          <>
            <Spacer />
            <Hr styles={{width: '100%'}} />
            <Spacer times={4} />
            <MoreDetail t={t} txHash={activity.transactionHash} />
          </>
        )}
      </View>
      <Spacer />
      {!isOpen && !isLast && <Hr styles={{width: 340, marginBottom: 8}} />}
    </View>
  );
}

export type TMoreDetailProps = {
  t: TFunction<'translation', undefined>;
  txHash?: string | null;
};

export function MoreDetail(props: TMoreDetailProps) {
  const {t, txHash} = props;

  const toast = useToast();

  const {explorerUrl} = useConfig();

  const handleCopy = useCallback(() => {
    if (txHash) {
      Clipboard.setString(txHash);
    }
    toast?.show('myProfile.copied', {type: AlertMode.Success, translate: true});
  }, [toast, txHash]);

  const handleOpenInBrowser = useCallback(async () => {
    if (isWeb()) {
      return Linking.openURL(`${explorerUrl}/tx/${txHash}`);
    }
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(`${explorerUrl}/tx/${txHash}`, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: colors.green,
        preferredControlTintColor: colors.white,
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        hasBackButton: true,
        toolbarColor: colors.green,
        secondaryToolbarColor: colors.white,
        navigationBarColor: colors.white,
        navigationBarDividerColor: colors.white,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });
    }
  }, [explorerUrl, txHash]);

  return (
    <View style={styles.moreContainer}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <Text style={styles.receipt} onPress={handleOpenInBrowser}>
          {t('activities.receipt')} <IIcon name="open-outline" size={14} />
        </Text>
        <Text style={styles.address} onPress={handleCopy}>
          {wrapUpString(`${explorerUrl}/tx/${txHash}`, 20, 3)} <FIcon name="copy" size={14} />
        </Text>
      </View>
      {/*<Spacer times={3} />*/}
      {/*<TouchableOpacity onPress={() => console.log('show more details pressed')}>*/}
      {/*  <Text style={styles.showMore}>{t('activities.showMore')}</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  // open: {
  // marginTop: -9,
  // marginBottom: 24,
  // },
  container: {
    width: 358,
    padding: 8,
    backgroundColor: colors.khaki,
    borderRadius: 10,
  },
  tree: {
    width: 25,
    height: 25,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: colors.grayDarker,
    justifyContent: 'center',
  },
  date: {
    fontSize: 10,
    color: colors.grayOpacity,
  },
  status: {
    fontSize: 12,
    color: colors.grayLight,
  },
  prev: {
    fontSize: 12,
    color: colors.grayLight,
  },
  moreContainer: {
    width: '100%',
  },
  receipt: {
    fontSize: 14,
    color: '#5D5FEF',
  },
  address: {
    fontSize: 10,
    color: colors.grayLight,
  },
  showMore: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.grayDarker,
  },
});
