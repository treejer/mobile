import React from 'react';
import {Share, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {rangerUrl} from 'services/config';
import {isWeb} from 'utilities/helpers/web';
import {showAlert} from 'utilities/helpers/alert';
import Clipboard from '@react-native-clipboard/clipboard';

export interface InviteProps {
  planterType: number;
  address: string;
  style?: any;
}

export default function Invite(props: InviteProps) {
  const {planterType} = props;

  if (planterType === 2 || planterType === 1) {
    return <InviteOrgAndFriends {...props} />;
  } else {
    return null;
  }
}

export function InviteOrgAndFriends(props: InviteProps) {
  const {planterType, address, style} = props;

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();

  const isOrg = planterType === 2;
  const text = `${t('invite.title')}`;

  const handleInvite = () => {
    sendEvent('invite');
    const key = isOrg ? 'organization' : 'referrer';
    const message = `${rangerUrl}/${key}/${address}`;

    if (isWeb()) {
      Clipboard.setString(message);
      showAlert({
        message: t('invite.copied'),
      });
    } else {
      Share.share({
        message,
      });
    }
  };

  return (
    <>
      <Button caption={text} variant="tertiary" onPress={handleInvite} style={style} />
      <Spacer times={4} />
    </>
  );
}
