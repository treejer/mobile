import React, {useCallback} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/Feather';
import BrandIcon from 'react-native-vector-icons/FontAwesome5';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

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

  const handleOpenSupportLink = useCallback(async () => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(support.link, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: support.color,
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
        toolbarColor: support.color,
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
        headers: {
          'my-custom-header': 'my custom header value',
        },
      });
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
