import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Yup from 'yup';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {CreateModelForm, TCreateModelForm} from 'screens/TreeSubmission/components/Models/CreateModelForm';
import {TreeImage} from '../../../../../assets/icons';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.CreateModel>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.CreateModel>;

export interface CreateModelProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

const schema = Yup.object().shape({
  country: Yup.string().required('required'),
  species: Yup.string().required('required'),
  price: Yup.string()
    .matches(/^[0-9]*$/, 'number')
    .required('required'),
  count: Yup.string()
    .matches(/^[0-9]*$/, 'number')
    .required('required'),
});

export function CreateModel(props: CreateModelProps) {
  const {} = props;

  const [loading, setLoading] = useState(false);

  const {t} = useTranslation();

  const handleCreateModel = useCallback((data: TCreateModelForm) => {
    try {
      console.log(data, 'create model form data is here');
      // setLoading(true);
      // send transaction
    } catch (e: any) {
      console.log(e, 'error is here');
    } finally {
      // setLoading(false)
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
