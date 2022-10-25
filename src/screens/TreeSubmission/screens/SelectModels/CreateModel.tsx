import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useToast} from 'react-native-toast-notifications';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import {CreateModelForm, TCreateModelForm} from 'screens/TreeSubmission/components/Models/CreateModelForm';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {AlertMode} from 'utilities/helpers/alert';
import {useConfig, useWalletAccount, useWalletWeb3} from '../../../../redux/modules/web3/web3';
import {useSettings} from '../../../../redux/modules/settings/settings';
import {TreeImage} from '../../../../../assets/icons';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.CreateModel>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.CreateModel>;

export interface CreateModelProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

export function CreateModel(props: CreateModelProps) {
  const {navigation} = props;

  const [loading, setLoading] = useState(false);

  const config = useConfig();
  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();
  const {useGSN} = useSettings();

  const toast = useToast();
  const {t} = useTranslation();

  const handleCreateModel = useCallback(async (data: TCreateModelForm) => {
    try {
      console.log(data, 'create model form data is here');
      setLoading(true);
      const args = [Number(data.countryNumCode), 0, web3.utils.toWei(data.price, 'ether'), data.count];
      const receipt = await sendTransactionWithGSN(
        config,
        ContractType.MarketPlace,
        web3,
        wallet,
        'addModel',
        args,
        useGSN,
      );
      console.log(receipt.transactionHash, 'create modal transaction hash');
      toast.show(t('createModel.success'), {
        type: AlertMode.Success,
      });
      navigation.navigate(Routes.SelectModels);
    } catch (e: any) {
      console.log(e, 'error is here');
      toast.show(t('createModel.failed'), {
        type: AlertMode.Error,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle goBack title={t('createModel.title')} />
      <CreateModelForm onSubmit={handleCreateModel} loading={loading} />
      <Spacer times={12} />
      <View style={styles.tree}>
        <Image source={TreeImage} style={{width: 104, height: 104}} />
        <Spacer />
        <Text>{t('createModel.createYours')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tree: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
