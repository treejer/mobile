import React, {useCallback} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/Feather';
import BrandIcon from 'react-native-vector-icons/FontAwesome5';

import Card from 'components/Card';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {useTranslation} from 'react-i18next';

export type TSupportItemProps = {
  support: {
    name: string;
    link: string;
    icon: string;
    color: string;
  };
};

export function SupportItem(props: TSupportItemProps) {
  const {support} = props;

  const {t} = useTranslation();
  const toast = useToast();

  const handleOpenSupportLink = useCallback(() => {
    if (support.link) {
      Linking.openURL(support.link);
    } else {
      toast.show('We are developing...');
    }
  }, [support.link]);

  return (
    <Card style={styles.container}>
      <TouchableOpacity style={[styles.row, styles.supportBtn]} onPress={handleOpenSupportLink}>
        <View style={styles.brand}>
          <BrandIcon name={support.icon} size={40} color={support.color} />
        </View>
        <View style={[styles.row, styles.nameSection]}>
          <Text style={styles.name}>{t(`supports.${support.name}`)}</Text>
          <Icon name="chevron-right" size={22} color={colors.grayDarker} />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 64,
    paddingVertical: 0,
    backgroundColor: colors.khaki,
    marginBottom: 18,
  },
  brand: {
    width: 52,
  },
  supportBtn: {
    ...globalStyles.fill,
    ...globalStyles.alignItemsCenter,
  },
  row: {
    flexDirection: 'row',
  },
  nameSection: {
    ...globalStyles.fill,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.grayDarker,
  },
});
