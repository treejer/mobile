import {useCallback} from 'react';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {colors} from 'constants/values';
import {Linking} from 'react-native';
import {TSupportItem} from 'screens/Profile/components/supportList';

export function useInAppBrowser() {
  const handleOpenLink = useCallback(async (chatItem: TSupportItem) => {
    const isAvailable = await InAppBrowser.isAvailable();
    if (isAvailable) {
      await InAppBrowser.open(chatItem.link, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: chatItem.color,
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
        toolbarColor: chatItem.color,
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
    } else {
      await Linking.openURL(chatItem.link);
    }
  }, []);

  return {
    handleOpenLink,
  };
}
