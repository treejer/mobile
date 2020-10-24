import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {Account} from 'web3-core';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import TextField from 'components/TextField';
import {ChevronLeft} from 'components/Icons';
import Steps from 'components/Steps';
import {usePrivateKeyStorage, useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {}

function CreateWallet(props: Props) {
  const navigation = useNavigation();
  const {control, handleSubmit, errors} = useForm<{
    password: string;
  }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const web3 = useWeb3();
  const {storePrivateKey} = usePrivateKeyStorage();

  const handleConnectWallet = handleSubmit(({password}) => {
    setLoading(true);

    requestAnimationFrame(() => {
      const account = web3.eth.accounts.create();
      web3.eth.accounts.wallet.add(account);
      storePrivateKey(account.privateKey, password);
      setAccount(account);
      setCurrentStep(2);
      setLoading(false);
    });
  });

  const doneMarkup = <Text style={[globalStyles.normal]}>Done!</Text>;

  const recoveryPhrase = ['carrot', 'basket', 'horse', 'donkey', 'camel', 'yaboo', 'pig', 'sheep', 'goat'];

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, globalStyles.p3]}>
        <Spacer times={8} />
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text style={[globalStyles.fill, globalStyles.h4, globalStyles.pl1, globalStyles.textCenter]}>
            Create Wallet
          </Text>
          <ChevronLeft color="transparent" />
        </View>
        <Spacer times={8} />

        <Steps.Container currentStep={currentStep} style={{width: 300}}>
          {/* Step 1 - Enter Password */}
          <Steps.Step step={1}>
            <View>
              <Text style={globalStyles.h6}>Set up wallet</Text>
              {currentStep > 1 ? (
                doneMarkup
              ) : (
                <>
                  {/* <Spacer times={3} />
                  <TextField
                    control={control}
                    name="password"
                    placeholder="Password"
                    secureTextEntry
                    rules={{required: true}}
                    error={errors.password}
                  />
                  <Spacer times={1} />
                  <Text style={globalStyles.normal}>Some hint about the password</Text> */}
                  <Spacer times={3} />
                  <View
                    style={[globalStyles.alignItemsStart, globalStyles.alignItemsCenter, globalStyles.horizontalStack]}
                  >
                    <Button
                      disabled={loading}
                      variant="success"
                      caption="Set up account"
                      onPress={handleConnectWallet}
                    />
                    <Spacer />
                    {loading && <ActivityIndicator color="#000000" />}
                  </View>
                  <Spacer times={2} />
                </>
              )}
            </View>
          </Steps.Step>

          {/* Step 2 - Recovery Phrase */}
          <Steps.Step step={2} lastStep>
            <View style={globalStyles.alignItemsStart}>
              <Text style={globalStyles.h6}>Recovery phrase</Text>
              <Spacer times={1} />

              {currentStep === 2 && (
                <>
                  <Spacer times={2} />
                  <View style={[globalStyles.horizontalStack, {flexWrap: 'wrap'}]}>
                    {recoveryPhrase.map(word => (
                      <Text key={word} style={[globalStyles.normal, styles.word]}>
                        {word}
                      </Text>
                    ))}
                  </View>
                  <Spacer times={2} />
                  <Text style={[globalStyles.normal]}>{JSON.stringify(account)}</Text>
                  <Spacer times={3} />
                  <View style={globalStyles.alignItemsStart}>
                    <Button variant="success" caption="Done" onPress={() => navigation.goBack()} />
                  </View>
                </>
              )}
            </View>
          </Steps.Step>
        </Steps.Container>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  word: {
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1,
  },
});

export default CreateWallet;
