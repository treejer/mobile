import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BackgroundEntropy from 'components/BackgroundEntropy';
import Button from 'components/Button';
import {Tree} from 'components/Icons';
import Spacer from 'components/Spacer';

function SignUp() {
  return (
    <View style={[globalStyles.fill, globalStyles.screenView]}>
      <BackgroundEntropy />
      <View style={[globalStyles.alignItemsCenter, globalStyles.justifyContentCenter, globalStyles.fill]}>
        <Image source={require('../../../assets/images/sign-up.png')} />

        <Spacer times={3} />
        <Text style={globalStyles.h4}>Welcome!</Text>
        <Spacer times={1} />

        <View style={[globalStyles.pt3, styles.buttonsWrapper]}>
          <Button
            textStyle={[globalStyles.textCenter, globalStyles.fill]}
            caption="AMBASSADOR"
            variant="cta"
            icon={Tree}
          />
          <Spacer times={6} />
          <Button
            textStyle={[globalStyles.textCenter, globalStyles.fill]}
            caption="PLANTER"
            variant="cta"
            icon={Tree}
          />
          <Spacer times={6} />

          <View style={[globalStyles.horizontalStack, globalStyles.justifyContentCenter]}>
            <Text style={globalStyles.small}>Have an account? </Text>
            <TouchableOpacity>
              <Text style={[globalStyles.small, styles.signInText]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signInText: {
    color: colors.green,
  },
  buttonsWrapper: {
    width: 200,
  },
});

export default SignUp;
