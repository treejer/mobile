import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useToast} from 'react-native-toast-notifications';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {CreateModelForm, TCreateModelForm} from 'screens/TreeSubmission/components/Models/CreateModelForm';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {sendWeb3Transaction} from 'utilities/helpers/sendTransaction';
import {AlertMode} from 'utilities/helpers/alert';
import {useConfig, useMagic, useWalletAccount, useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {TreeImage} from '../../../../../assets/icons';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.CreateModel>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.CreateModel>;

export interface CreateModelProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

export function CreateModel(props: CreateModelProps) {
  const {navigation, plantTreePermissions} = props;
  const {showPermissionModal} = plantTreePermissions;

  const [loading, setLoading] = useState(false);

  const config = useConfig();
  const web3 = useWalletWeb3();
  const magic = useMagic();
  const wallet = useWalletAccount();
  const {useBiconomy} = useSettings();

  const toast = useToast();
  const {t} = useTranslation();

  const handleCreateModel = useCallback(
    async (data: TCreateModelForm) => {
      try {
        console.log(data, 'create model form data is here');
        setLoading(true);
        const args = [Number(data.countryNumCode), 0, web3.utils.toWei(data.price, 'ether'), data.count];
        const receipt = await sendWeb3Transaction(
          magic,
          config,
          ContractType.MarketPlace,
          web3,
          wallet,
          'addModel',
          args,
          useBiconomy,
        );
        console.log(receipt.transactionHash, 'create modal transaction hash');
        toast.show('createModel.success', {
          type: AlertMode.Success,
          translate: true,
        });
        navigation.navigate(Routes.SelectModels);
      } catch (e: any) {
        console.log(e, 'error is here');
        toast.show('createModel.failed', {
          type: AlertMode.Error,
          translate: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [magic, config, navigation, toast, useBiconomy, wallet, web3],
  );

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

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
