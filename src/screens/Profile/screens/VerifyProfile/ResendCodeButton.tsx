import React, {useState} from 'react';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {useTimer} from 'utilities/hooks/useTimer';

export interface ResendCodeButtonProps {
  resendCode: () => void;
  loading: boolean;
}

export default function ResendCodeButton(props: ResendCodeButtonProps) {
  const {loading, resendCode} = props;

  const [isTimeYet, setIsTimeYet] = useState(false);

  const {t} = useTranslation();

  const [time, setTimer] = useTimer(120, () => setIsTimeYet(true));

  const handlePress = async () => {
    await resendCode();
    setIsTimeYet(false);
    setTimer(120);
  };

  return (
    <Button
      variant="cta"
      onPress={handlePress}
      disabled={loading || !isTimeYet}
      loading={loading}
      caption={`${t('resend')} ${time ? `${time}s` : ''}`}
      style={{
        height: 33,
        paddingVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
