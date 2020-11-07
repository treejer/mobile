import React, {useState} from 'react';
import {View, Text, Image, InteractionManager, ActivityIndicator} from 'react-native';

import BackgroundEntropy from 'components/BackgroundEntropy';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {useForm} from 'react-hook-form';
import TextField from 'components/TextField';
import {usePrivateKeyStorage} from 'services/web3';
import {colors} from 'constants/values';
import {useTransition} from 'utilities/hooks';
import Animated from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  privateKeyExists: boolean;
}

function PasswordProtected({children, privateKeyExists}: Props): React.ReactElement {
  const {control, handleSubmit, errors, setError} = useForm<{
    password: string;
  }>();
  const [loading, setLoading] = useState(false);

  const {unlock, unlocked} = usePrivateKeyStorage();

  const handleUnlock = handleSubmit(({password}) => {
    let result = false;
    setLoading(true);

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(async () => {
        try {
          await unlock(password);
        } catch {}

        if (!result) {
          setLoading(false);
          setError('password', {type: 'validate', message: 'Invalid password'});
        }
      });
    });
  });

  const width = Animated.interpolate(useTransition(loading), {
    inputRange: [0, 1],
    outputRange: [0, 100],
  });
  
  // return children as React.ReactElement;

  if (!privateKeyExists || unlocked) {
    return children as React.ReactElement;
  }

  return (
    <View style={globalStyles.fill}>
      <BackgroundEntropy />
      <View style={[globalStyles.alignItemsCenter, globalStyles.justifyContentCenter, globalStyles.fill]}>
        <Text style={[globalStyles.h2, globalStyles.textCenter, globalStyles.mb1]}>TREEJER{'\n'}RANGER APP</Text>
        <Text style={[globalStyles.h6, globalStyles.textCenter]}>Enter your password to unlock the app</Text>

        <View style={[globalStyles.horizontalStack, globalStyles.p3]}>
          <TextField
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
            error={errors.password}
            rules={{required: true}}
            style={[globalStyles.fill]}
            returnKeyType="go"
          />
        </View>

        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter]}>
          <Button disabled={loading} caption="Unlock Treejer" variant="cta" onPress={handleUnlock} />
          {loading && (
            <Animated.View style={{width}}>
              <ActivityIndicator color={colors.green} size="large" />
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

export default PasswordProtected;
