import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MapView, {Polygon, Marker, Region} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {Point, pointSort, upperLeft} from 'utilities/helpers/latLng';
import Steps from 'components/Steps';
import Spacer from 'components/Spacer';
import TextField from 'components/TextField';
import {useForm, useWatch} from 'react-hook-form';
import Button from 'components/Button';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import {useWalletAccount, useWeb3, useGBFactory} from 'services/web3';

interface Props {}

interface FormFields {
  polygon: Point[];
  title: string;
}

function CreateGreenBlcok(_: Props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const mapViewRef = useRef<MapView>();
  const web3 = useWeb3();
  const gbFactory = useGBFactory();
  const wallet = useWalletAccount();
  const [submitting, setSubmitting] = useState(false);
  const initialMapRegion = useRef<Region>({
    latitude: 37,
    longitude: 35,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const form = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      polygon: [],
      title: '',
    },
    shouldUnregister: false,
  });

  const polygon = useWatch<Point[]>({
    name: 'polygon',
    control: form.control,
  });

  const handleCreateGreenBlock = form.handleSubmit(async data => {
    setSubmitting(true);
    try {
      const tx = gbFactory.methods.create(
        data.title,
        JSON.stringify(data.polygon.map(({latitude, longitude}) => ({lat: latitude, lng: longitude}))),
        '0x0000000000000000000000000000000000000000',
        [wallet.address],
      );

      const receipt = await sendTransaction(web3, tx, gbFactory.options.address, wallet);
      console.log('receipt', receipt.transactionHash);
    } catch (error) {
      console.log('error', error);
    } finally {
      setSubmitting(false);
    }
  });

  useEffect(() => {
    (async () => {
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        return;
      }

      const {
        coords: {latitude, longitude},
      } = await Location.getCurrentPositionAsync({
        mayShowUserSettingsDialog: true,
      });

      initialMapRegion.current = {
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05,
      };

      if (mapViewRef.current) {
        mapViewRef.current.animateToRegion(initialMapRegion.current);
      }
    })();
  }, [mapViewRef]);

  const sortedPolygon = useMemo(() => [...polygon].sort(pointSort(upperLeft(polygon))), [polygon]);

  const currentStep = useMemo(() => {
    if (!form.formState.dirtyFields.title || form.formState.errors.title) {
      return 1;
    }

    if (polygon.length < 3) {
      return 2;
    }

    return 3;
  }, [form.formState, polygon]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, globalStyles.p3]}>
        <Spacer times={8} />
        <Text style={[globalStyles.h5, globalStyles.textCenter]}>Create a Green Block</Text>
        <Spacer times={8} />
        <Steps.Container currentStep={currentStep} style={{width: '100%'}}>
          {/* Step 1  */}
          <Steps.Step step={1}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Green block title</Text>
              <Spacer times={4} />

              <TextField
                name="title"
                control={form.control}
                style={{width: '90%'}}
                placeholder="Greenblock title"
                success={form.formState.dirtyFields.title && !form.formState.errors.title}
                rules={{required: true, minLength: 3}}
              />
            </View>
          </Steps.Step>

          {/* Step 2 */}
          <Steps.Step step={2}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Submit tree location</Text>

              {isFocused && currentStep > 1 && (
                <>
                  <Spacer times={4} />
                  <Text style={globalStyles.body1}>Start tapping on the map to draw your green block polygon</Text>
                  <Spacer times={4} />

                  <MapView
                    style={{
                      width: '100%',
                      height: 250,
                    }}
                    onPress={event => {
                      const coordinate = event.nativeEvent?.coordinate;
                      if (coordinate) {
                        form.setValue('polygon', [...polygon, new Point(coordinate.latitude, coordinate.longitude)]);
                      }
                    }}
                    ref={mapViewRef}
                    initialRegion={initialMapRegion.current}
                  >
                    {polygon.length > 2 && (
                      <Polygon
                        coordinates={sortedPolygon}
                        fillColor="rgba(255, 40, 30, 0.2)"
                        strokeColor="rgba(255, 40, 30, 0.4)"
                        strokeWidth={3}
                      />
                    )}
                    {polygon.length < 4 &&
                      polygon.map((point, index) => (
                        <Marker key={index} coordinate={point}>
                          <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'red'}} />
                        </Marker>
                      ))}
                  </MapView>

                  <Spacer />

                  <View style={globalStyles.horizontalStack}>
                    <Button
                      caption="Undo"
                      onPress={() => {
                        form.setValue('polygon', polygon.slice(0, -1));
                      }}
                    />
                    <Spacer times={2} />
                    <Button
                      caption="Reset"
                      onPress={() => {
                        form.setValue('polygon', []);
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </Steps.Step>

          {/* Step 3 */}
          <Steps.Step step={3} lastStep>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Confirmation</Text>
              <Spacer times={4} />

              {currentStep === 3 && (
                <Button
                  variant="success"
                  caption="Submit"
                  loading={submitting}
                  disabled={submitting}
                  onPress={handleCreateGreenBlock}
                />
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
  mapImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
  },
});

export default CreateGreenBlcok;
