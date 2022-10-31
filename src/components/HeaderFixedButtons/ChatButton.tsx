import React, {useEffect} from 'react';
import {chatItem} from 'screens/Profile/components/supportList';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from 'constants/values';
import {isWeb} from 'utilities/helpers/web';
import {useToast} from 'react-native-toast-notifications';
import {useTranslation} from 'react-i18next';
import {ScreenTitleWithoutNavigation} from 'components/ScreenTitle/ScreenTitleWithoutNavigation';
import {useInAppBrowser} from 'utilities/hooks/useInAppBrowser';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';

export function ChatButton() {
  const {showSupportChat, setShowSupportChat} = useSettings();

  useEffect(() => {
    console.log('showSupportChat', showSupportChat);
  }, [showSupportChat]);

  const {t} = useTranslation();

  const {handleOpenLink} = useInAppBrowser();

  const toast = useToast();

  const handlePress = async () => {
    try {
      if (isWeb()) {
        setShowSupportChat(true);
      } else {
        await handleOpenLink(chatItem);
      }
    } catch (e: any) {
      toast.show(e.message, {type: 'danger'});
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Text style={styles.text}>{t('supports.needHelp')}</Text>
        <Spacer />
        <Icon name="question" size={12} color={colors.white} />
      </TouchableOpacity>
      {isWeb() ? (
        <View
          // @ts-ignore
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999,
            display: showSupportChat ? 'flex' : 'none',
          }}
        >
          <View style={styles.header}>
            <ScreenTitleWithoutNavigation
              goBack
              title={t('supports.chatHeader')}
              handleGoBack={() => setShowSupportChat(false)}
            />
          </View>
          <View style={{flex: 1}}>
            <iframe src={chatItem.link} style={{width: '100%', height: '100%', border: 'none'}} />
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: 'rgb(81, 111, 144)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 22,
    flexDirection: 'row',
  },
  text: {
    ...globalStyles.tiny,
    color: colors.white,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    backgroundColor: colors.khaki,
  },
});
