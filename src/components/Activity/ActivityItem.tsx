import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TFunction, useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-clipboard/clipboard';
import {useToast} from 'react-native-toast-notifications';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

import {Hr} from 'components/common/Hr';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {AlertMode} from 'utilities/helpers/alert';
import {EthCoin, MaticCoin, StableDaiCoin, Tree} from '../../../assets/images';

export enum ActivityStatus {
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  UPDATESUBMITTED = 'updateSubmitted',
  UPDATEVERIFIED = 'updateVerified',
  CLAIMED = 'claimed',
  SENT = 'sent',
  RECEIVED = 'received',
}

export enum ContractTypes {
  DAI = 'dai',
  MATIC = 'matic',
  ETH = 'eth',
}

export type TActivityItemProps = {
  tempId?: string;
  treeId?: string;
  amount?: string;
  date: Date;
  isLast?: boolean;
  contract?: ContractTypes;
  status: ActivityStatus;
  address: string;
};

export function ActivityItem(props: TActivityItemProps) {
  const {status, amount, contract, date, treeId, tempId, isLast, address} = props;

  const [isOpen, setIsOpen] = useState(false);

  const {t} = useTranslation();

  const bgTree = useMemo(
    () => ({
      submitted: colors.yellow,
      verified: colors.green,
      updateSubmitted: colors.pink,
      updateVerified: colors.grayOpacity,
    }),
    [],
  );

  const title = useMemo(
    () => (!treeId && !tempId ? amount : status === ActivityStatus.SUBMITTED ? `New ${tempId}` : treeId),
    [status, amount, tempId, treeId],
  );

  const image = useMemo(
    () => (contract === ContractTypes.ETH ? EthCoin : contract === ContractTypes.MATIC ? MaticCoin : StableDaiCoin),
    [contract],
  );

  const handleOpenDetails = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  return (
    <View style={globalStyles.alignItemsCenter}>
      <Spacer />
      <View style={[styles.container, isOpen && [colors.smShadow, styles.open]]}>
        <View style={styles.row}>
          {treeId || tempId ? (
            <View style={[styles.image, {backgroundColor: bgTree[status]}]}>
              <Image source={Tree} style={styles.tree} />
            </View>
          ) : (
            <Image source={image} style={styles.image} />
          )}
          <Spacer />
          <View style={[styles.row, styles.detail]}>
            <View>
              <Text style={styles.title}>
                {contract
                  ? t(`activities.${contract}`, {amount: title})
                  : status === ActivityStatus.SUBMITTED
                  ? t(`activities.new`, {tempId})
                  : title}
                {status === ActivityStatus.VERIFIED ? (
                  <Text style={styles.prev}>
                    <FIcon name="long-arrow-left" /> {t('activities.new', {tempId})}
                  </Text>
                ) : null}
              </Text>
              <Text style={styles.date}>{date.toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={handleOpenDetails}>
              <Text style={styles.status}>{t(`activities.${status}`)}</Text>
              <Spacer />
              <Icon
                style={{marginTop: 4, transform: [{rotate: isOpen ? '90deg' : '0deg'}]}}
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
            <MoreDetail t={t} address={address} />
          </>
        )}
      </View>
      <Spacer />
      {!isOpen && !isLast && <Hr styles={{width: 340}} />}
    </View>
  );
}

export type TMoreDetailProps = {
  t: TFunction<'translation', undefined>;
  address: string;
};

export function MoreDetail(props: TMoreDetailProps) {
  const {t, address} = props;

  const toast = useToast();

  const handleCopy = useCallback(() => {
    Clipboard.setString(address);
    toast.show(t('myProfile.copied'), {type: AlertMode.Success});
  }, [address]);

  const handleOpenInBrowser = useCallback(async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(address, {
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
  }, []);

  return (
    <View style={{width: '100%'}}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <Text style={styles.receipt} onPress={handleOpenInBrowser}>
          {t('activities.receipt')} <IIcon name="open-outline" size={14} />
        </Text>
        <Text style={styles.address} onPress={handleCopy}>
          {address} <Icon name="copy" size={14} />
        </Text>
      </View>
      <Spacer times={3} />
      <TouchableOpacity onPress={() => console.log('show more details pressed')}>
        <Text style={styles.showMore}>{t('activities.showMore')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  open: {
    marginTop: -9,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
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
    fontSize: 14,
    color: colors.grayLight,
  },
  prev: {
    fontSize: 12,
    color: colors.grayLight,
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
    ...globalStyles.textCenter,
    fontSize: 16,
    color: colors.grayDarker,
  },
});
