import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import BrandIcon from 'react-native-vector-icons/FontAwesome5';

import Card from 'components/Card';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {isWeb} from 'utilities/helpers/web';
import {TreejerIcon} from '../../../../assets/images';
import {chatItem, TSupportItem} from 'screens/Profile/components/supportList';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useInAppBrowser} from 'utilities/hooks/useInAppBrowser';

export type TSupportItemProps = {
  support: TSupportItem;
};

export function SupportItem(props: TSupportItemProps) {
  const {support} = props;

  const {setShowSupportChat} = useSettings();
  const {handleOpenLink} = useInAppBrowser();

  const {t} = useTranslation();

  const handleOpenSupportLink = useCallback(async () => {
    if (isWeb()) {
      if (support.name === chatItem.name) {
        setShowSupportChat(true);
      } else {
        await Linking.openURL(support.link);
      }
    } else {
      await handleOpenLink(support);
    }
  }, [handleOpenLink, setShowSupportChat, support]);

  return (
    <Card style={styles.container}>
      <TouchableOpacity style={[styles.row, styles.supportBtn]} onPress={handleOpenSupportLink}>
        <View style={styles.brand}>
          {support.icon ? (
            <BrandIcon name={support.icon} size={40} color={support.color} />
          ) : (
            <Image source={TreejerIcon} style={styles.image} />
          )}
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
    justifyContent: 'center',
  },
  brand: {
    width: 52,
    alignItems: 'flex-start',
  },
  supportBtn: {
    ...globalStyles.fill,
    ...globalStyles.alignItemsCenter,
  },
  row: {
    flexDirection: 'row',
  },
  nameSection: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.grayDarker,
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: -4,
  },
});
