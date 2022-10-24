import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {Country, CountryCode} from 'react-native-country-picker-modal';
import axios from 'axios';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {NetworkConfig} from 'services/config';
import Spacer from 'components/Spacer';
import {CreateModelInput} from 'screens/TreeSubmission/components/Models/CreateModelInput';

export type TCreateModelForm = {
  country: string;
  countryNumCode: string;
  species: string;
  price: string;
  count: string;
};

const defaultValues: TCreateModelForm = {
  country: '',
  countryNumCode: '',
  species: '0',
  price: '',
  count: '',
};

const schema = Yup.object().shape({
  country: Yup.string().required('required'),
  species: Yup.string().required('required'),
  price: Yup.string()
    .test('greater-than-one', 'min', (value?: string) => {
      if (value) {
        return Number(value) > 0;
      } else {
        return true;
      }
    })
    .required('required')
    .matches(/^([0-9]*[.])?[0-9]+$/, 'number'),
  count: Yup.string()
    .test('greater-than-one', 'min', (value?: string) => {
      if (value) {
        return Number(value) > 0;
      } else {
        return true;
      }
    })
    .required('required')
    .matches(/^[0-9]*$/, 'number'),
});

export type TCrateModelFormProps = {
  onSubmit: (data: TCreateModelForm) => void;
  loading: boolean;
  config: NetworkConfig;
};

export type TreejerCountry = {
  id: string;
  iso: string;
  name: string;
  nicename: string;
  iso3: string;
  numcode: number;
  phonecode: number;
};

export function CreateModelForm(props: TCrateModelFormProps) {
  const {loading, config, onSubmit} = props;

  const [countries, setCountries] = useState<TreejerCountry[] | null>(null);
  const [availableCountries, setAvailableCountries] = useState<CountryCode[] | null>(null);

  const {control, formState, handleSubmit, watch, setValue} = useForm<TCreateModelForm>({
    mode: 'all',
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });
  const {t} = useTranslation();

  const [countryCode, setCountryCode] = useState<CountryCode>('US');

  useEffect(() => {
    (async () => {
      const {data: countryData} = await axios.get(`${config.treejerApiUrl}/resources/countries.min.json`);
      setAvailableCountries(countryData.map(country => country.iso));
      setCountries(countryData);
    })();
  }, []);

  const handleSelectCountry = useCallback(
    (country: Country) => {
      setCountryCode(country.cca2);
      setValue('country', country.name as string, {
        shouldTouch: true,
        shouldValidate: true,
      });
      const numCode = countries?.find(Tcountry => Tcountry.iso == country.cca2)?.numcode;
      setValue('countryNumCode', `${numCode}`, {
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [countries, availableCountries],
  );

  const handleCloseCountry = useCallback(() => {
    setValue('country', watch().country, {
      shouldTouch: true,
      shouldValidate: true,
    });
  }, []);

  return (
    <View style={[globalStyles.fill, globalStyles.alignItemsCenter]}>
      <CreateModelInput
        control={control}
        name="country"
        label="country"
        availableCountries={availableCountries}
        value={watch().country}
        countryCode={countryCode}
        onSelectCountry={handleSelectCountry}
        onCloseCountry={handleCloseCountry}
        placeholder={t('createModel.placeholder.country')}
        disabled={loading}
        error={
          formState.touchedFields.country && formState.errors.country ? formState.errors.country.message : undefined
        }
      />
      <Spacer />
      {/*<CreateModelInput*/}
      {/*  control={control}*/}
      {/*  name="species"*/}
      {/*  label="species"*/}
      {/*  placeholder={t('createModel.placeholder.species')}*/}
      {/*  error={*/}
      {/*    formState.touchedFields.species && formState.errors.species ? formState.errors.species.message : undefined*/}
      {/*  }*/}
      {/*/>*/}
      {/*<Spacer />*/}
      <CreateModelInput
        control={control}
        name="price"
        label="price"
        placeholder={t('createModel.placeholder.price')}
        disabled={loading}
        error={formState.touchedFields.price && formState.errors.price ? formState.errors.price.message : undefined}
      />
      <Spacer />
      <CreateModelInput
        control={control}
        name="count"
        label="count"
        placeholder={t('createModel.placeholder.count')}
        disabled={loading}
        error={formState.touchedFields.count && formState.errors.count ? formState.errors.count.message : undefined}
        preview={Number(watch().price) * Number(watch().count)}
      />
      <Spacer times={8} />
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!formState.isValid}
        style={[styles.btn, formState.isValid ? styles.submitBtn : styles.disabledBtn]}
      >
        <Text style={!formState.isValid ? styles.muteText : styles.whiteText}>{t('createModel.form.create')}</Text>
        {loading ? <ActivityIndicator color={colors.white} style={{marginLeft: 8}} /> : null}
      </TouchableOpacity>
    </View>
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
