import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import FIcon from 'react-native-vector-icons/FontAwesome';

import {Hr} from 'components/common/Hr';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
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
};

export function ActivityItem(props: TActivityItemProps) {
  const {status, amount, contract, date, treeId, tempId, isLast} = props;

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
      <TouchableOpacity
        style={[styles.row, styles.container, isOpen && [colors.smShadow, styles.open]]}
        onPress={handleOpenDetails}
      >
        {treeId || tempId ? (
          <View style={[styles.image, {backgroundColor: bgTree[status]}]}>
            <Image source={Tree} width={25} height={25} />
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
          <View style={styles.row}>
            <Text style={styles.status}>{t(`activities.${status}`)}</Text>
            <Spacer />
            <Icon
              style={{marginTop: 4, transform: [{rotate: isOpen ? '90deg' : '0deg'}]}}
              name="chevron-down"
              size={20}
              color={colors.grayLight}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Spacer />
      {!isOpen && !isLast && <Hr styles={{width: 340}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  open: {
    marginTop: -9,
    marginBottom: 24,
    height: 100,
    alignItems: 'flex-start',
  },
  container: {
    width: 358,
    padding: 8,
    backgroundColor: colors.khaki,
    borderRadius: 10,
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
    ...globalStyles.fill,
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
});
