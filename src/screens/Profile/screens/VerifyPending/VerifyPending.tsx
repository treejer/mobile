import React from 'react';
import {View, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {Routes, UnVerifiedUserNavigationProp} from 'navigation/index';
import globalStyles from 'constants/styles';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Card from 'components/Card';
import {EastWoodMessage} from '../../../../../assets/images';
import {useProfile} from 'ranger-redux/modules/profile/profile';

interface Props extends UnVerifiedUserNavigationProp<Routes.VerifyPending> {}

function VerifyPending(props: Props) {
  const {navigation} = props;

  const {t} = useTranslation();

  const {dispatchProfile} = useProfile();

  const handleContinue = () => {
    dispatchProfile();
    navigation.navigate(Routes.MyProfile, {hideVerification: true});
  };

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <View
        style={[
          globalStyles.screenView,
          globalStyles.fill,
          globalStyles.alignItemsCenter,
          globalStyles.safeArea,
          globalStyles.justifyContentCenter,
        ]}
      >
        <Image source={EastWoodMessage} />
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
    </SafeAreaView>
  );
}

export default VerifyPending;
