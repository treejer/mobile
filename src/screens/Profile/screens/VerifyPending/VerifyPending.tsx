import React from 'react';
import {View, Text, Image} from 'react-native';
import globalStyles from 'constants/styles';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Card from 'components/Card';
import {useTranslation} from 'react-i18next';
import {useCurrentUser} from 'services/currentUser';
import {Routes, UnVerifiedUserNavigationProp} from 'navigation';

interface Props extends UnVerifiedUserNavigationProp<Routes.VerifyPending> {}

function VerifyPending(props: Props) {
  const {navigation} = props;

  const {t} = useTranslation();

  const {refetchUser} = useCurrentUser();

  const handleContinue = () => {
    refetchUser();
    navigation.navigate(Routes.MyProfile, {hideVerification: true});
  };

  return (
    <View
      style={[
        globalStyles.screenView,
        globalStyles.fill,
        globalStyles.alignItemsCenter,
        globalStyles.safeArea,
        globalStyles.justifyContentCenter,
      ]}
    >
      <Image source={require('../../../../../assets/images/eastwood-message-sent-1.png')} />
      <Text style={[globalStyles.h3, globalStyles.textCenter]}>{t('verifyPending.title')}</Text>
      <Spacer times={7} />
      <View style={{paddingHorizontal: 40, paddingVertical: 20, width: '100%'}}>
        <Card style={globalStyles.alignItemsCenter}>
          <Text style={globalStyles.h2}>{t('verifyPending.tnx')}</Text>
          <Spacer times={5} />
          <Text style={[globalStyles.normal, globalStyles.textCenter, globalStyles.h5]}>
            {t('verifyPending.verifying')}
          </Text>
        </Card>
      </View>
      <Spacer times={7} />
      <Button variant="fourth" caption={t('verifyPending.continue')} onPress={handleContinue} />
    </View>
  );
}

export default VerifyPending;
