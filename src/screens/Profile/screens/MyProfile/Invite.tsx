import React from 'react';
import {Share, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import config from 'services/config';
import {useAnalytics} from 'utilities/hooks/useAnalytics';

export interface InviteProps {
  planterType: number;
  address: string;
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
  const {planterType, address} = props;

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();

  const isOrg = planterType === 2;
  const text = `${t('invite.title')}`;

  const handleInvite = () => {
    sendEvent('invite');
    const key = isOrg ? 'organization' : 'referrer';
    Share.share({
      message: `${config.rangerUrl}/${key}/${address}`,
    });
  };

  return (
    <View>
      <Button caption={text} variant="tertiary" onPress={handleInvite} />
      <Spacer times={4} />
    </View>
  );
}