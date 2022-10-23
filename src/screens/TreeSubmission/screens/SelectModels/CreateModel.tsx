import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {Routes} from 'navigation';
import {TreeSubmissionRouteParamList} from 'types';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {CreateModelInput} from 'screens/TreeSubmission/components/Models/CreateModelInput';

type NavigationProps = NativeStackNavigationProp<TreeSubmissionRouteParamList, Routes.CreateModel>;
type RouteNavigationProps = RouteProp<TreeSubmissionRouteParamList, Routes.CreateModel>;

export type TCreateModelForm = {
  country: string;
  species: string;
  price: string;
  count: string;
};

export interface CreateModelProps {
  navigation: NavigationProps;
  route: RouteNavigationProps;
  plantTreePermissions: TUsePlantTreePermissions;
}

const defaultValues: TCreateModelForm = {
  country: '',
  species: '',
  price: '',
  count: '',
};

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

  const {control, formState, handleSubmit} = useForm<TCreateModelForm>({
    mode: 'all',
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const {t} = useTranslation();

  const handleCreateModel = handleSubmit(data => {
    console.log(data, 'form data is here');
    console.log('create model pressed');
  });

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle goBack title={t('createModel.title')} />
      <View style={[globalStyles.fill, globalStyles.alignItemsCenter]}>
        <CreateModelInput
          control={control}
          name="country"
          label="country"
          placeholder={t('createModel.placeholder.country')}
          error={
            formState.touchedFields.country && formState.errors.country ? formState.errors.country.message : undefined
          }
        />
        <Spacer />
        <CreateModelInput
          control={control}
          name="species"
          label="species"
          placeholder={t('createModel.placeholder.species')}
          error={
            formState.touchedFields.species && formState.errors.species ? formState.errors.species.message : undefined
          }
        />
        <Spacer />
        <CreateModelInput
          control={control}
          name="price"
          label="price"
          placeholder={t('createModel.placeholder.price')}
          error={formState.touchedFields.price && formState.errors.price ? formState.errors.price.message : undefined}
        />
        <Spacer />
        <CreateModelInput
          control={control}
          name="count"
          label="count"
          placeholder={t('createModel.placeholder.count')}
          error={formState.touchedFields.count && formState.errors.count ? formState.errors.count.message : undefined}
        />
        <Spacer times={8} />
        <TouchableOpacity
          onPress={handleCreateModel}
          disabled={!formState.isValid}
          style={[styles.btn, formState.isValid ? styles.submitBtn : styles.disabledBtn]}
        >
          <Text style={!formState.isValid ? styles.muteText : styles.whiteText}>{t('createModel.form.create')}</Text>
          {loading ? <ActivityIndicator color={colors.white} style={{marginLeft: 8}} /> : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 360,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 6,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 40,
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  whiteText: {
    color: '#FFF',
  },
  muteText: {
    color: colors.gray,
  },
  submitBtn: {
    height: 48,
    backgroundColor: colors.green,
  },
  disabledBtn: {
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
});
