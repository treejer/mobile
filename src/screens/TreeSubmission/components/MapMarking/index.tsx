import MapboxGL from '@react-native-mapbox-gl/maps';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {locationPermission} from 'utilities/helpers/permissions';
import Map from './Map';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Button from 'components/Button';
import {Check, Times} from 'components/Icons';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {TreeFilter} from 'components/TreeList/TreeList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {usePersistedPlantedTrees} from 'utilities/hooks/usePlantedTrees';

interface IMapMarkingProps {
  journey?: TreeJourney;
  onSubmit?: (location: GeoPosition) => void;
}

export default function MapMarking({journey, onSubmit}: IMapMarkingProps) {
  const [accuracyInMeters, setAccuracyInMeters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [location, setLocation] = useState<GeoPosition>();
  const isConnected = useNetInfoConnected();
  const {dispatchAddOfflineTree, dispatchAddOfflineTrees} = useOfflineTrees();
  const {t} = useTranslation();

  const camera = useRef(null);
  const map = useRef(null);
  const navigation = useNavigation();

  const [isCameraRefVisible, setIsCameraRefVisible] = useState(!!camera?.current);

  const [persistedPlantedTrees] = usePersistedPlantedTrees();
  const {dispatchAddOfflineUpdateTree} = useOfflineTrees();

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (!!camera.current && !isCameraRefVisible) {
      setIsCameraRefVisible(true);
    }
  }, [camera, isCameraRefVisible]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        onUpdateUserLocation(position);
        setLocation(position);
        setAccuracyInMeters(position.coords.accuracy);
        setLoading(false);
      },
      err => {
        console.log(err, 'err in watch position');
      },
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
        interval: 1000,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (isInitial && location) {
      onPressMyLocationIcon(location);
    }
  }, [isCameraRefVisible, isInitial, location]);

  const checkPermission = async () => {
    try {
      await locationPermission();
      MapboxGL.setTelemetryEnabled(false);
      await updateCurrentPosition();
      return true;
    } catch (err) {
      if (err?.message == 'blocked') {
        console.log('blocked');
      } else if (err?.message == 'denied') {
        console.log('denied');
      } else {
        console.log(err, 'err inside checkPermission');
      }
      return false;
    }
  };

  // // generates the alphabets
  // const generateAlphabets = () => {
  //   let alphabetsArray: string[] = [];
  //   for (var x = 1, y; x <= 130; x++) {
  //     y = toLetters(x);
  //     alphabetsArray.push(y);
  //   }
  //   setAlphabets(alphabetsArray);
  // };

  // only the first time marker will follow the user's current location by default
  const onUpdateUserLocation = (userLocation: any) => {
    if (isInitial && userLocation) {
      onPressMyLocationIcon(userLocation);
    }
  };

  // recenter the marker to the current coordinates
  const onPressMyLocationIcon = (position: any) => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    if (isCameraRefVisible && camera?.current?.setCamera) {
      setIsInitial(false);
      camera.current.setCamera({
        centerCoordinate: [position.coords.longitude, position.coords.latitude],
        zoomLevel: 18,
        animationDuration: 1000,
      });
    }
  };

  // getting current position of the user with high accuracy
  const updateCurrentPosition = async () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          setAccuracyInMeters(position.coords.accuracy);
          onUpdateUserLocation(position);
          setLocation(position);
          resolve(position);
        },
        err => {
          console.log(err, 'err inside updateCurrentPosition');
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          accuracy: {
            android: 'high',
            ios: 'bestForNavigation',
          },
        },
      );
    });
  };

  const handleDismiss = useCallback(() => {
    if (journey) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'TreeSubmission'}],
        }),
      );
    } else {
      navigation.goBack();
    }
  }, [journey, navigation]);

  const handleSubmit = useCallback(() => {
    if (journey) {
      const newJourney = {
        ...journey,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      if (isConnected) {
        navigation.navigate('SubmitTree', {
          journey: newJourney,
        });
      } else {
        console.log(newJourney, 'newJourney offline tree');
        if (newJourney.isSingle === true) {
          dispatchAddOfflineTree(newJourney);
          Alert.alert(t('myProfile.attention'), t('myProfile.offlineTreeAdd'));
        } else if (newJourney.isSingle === false && newJourney.nurseryCount) {
          const offlineTrees = [];
          for (let i = 0; i < newJourney.nurseryCount; i++) {
            offlineTrees.push({
              ...newJourney,
              offlineId: Date.now() + i * 1000,
            });
          }
          dispatchAddOfflineTrees(offlineTrees);
          Alert.alert(t('myProfile.attention'), t('myProfile.offlineNurseryAdd'));
        } else if (newJourney?.tree?.treeSpecsEntity?.nursery) {
          const updatedTree = persistedPlantedTrees.find(item => item.id === journey.treeIdToUpdate);
          dispatchAddOfflineUpdateTree({
            ...journey,
            ...updatedTree,
            tree: updatedTree,
          });
          Alert.alert(t('treeInventory.updateTitle'), t('submitWhenOnline'));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Profile'}],
            }),
          );
          navigation.navigate('GreenBlock', {filter: TreeFilter.OfflineUpdate});
          return;
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Profile'}],
          }),
        );
        navigation.navigate('GreenBlock', {filter: TreeFilter.OfflineCreate});
      }
    } else {
      onSubmit?.(location);
    }
  }, [
    journey,
    location,
    isConnected,
    navigation,
    dispatchAddOfflineTree,
    t,
    dispatchAddOfflineTrees,
    persistedPlantedTrees,
    dispatchAddOfflineUpdateTree,
    onSubmit,
  ]);

  const initialMapCamera = () => {
    locationPermission()
      .then(() => {
        Geolocation.getCurrentPosition(
          position => {
            if (camera?.current?.setCamera) {
              camera.current.setCamera({
                centerCoordinate: [position.coords.longitude, position.coords.latitude],
                zoomLevel: 15,
                animationDuration: 1000,
              });
            }
          },
          err => {
            Alert.alert(err.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            accuracy: {
              android: 'high',
              ios: 'bestForNavigation',
            },
            useSignificantChanges: true,
            interval: 1000,
            fastestInterval: 1000,
          },
        );
      })
      .catch(err => {
        console.log({
          logType: 'other',
          message: 'Error while checking location permission',
          logStack: JSON.stringify(err),
        });
        if (err.message === 'blocked') {
          console.log('blocked');
        }
      });
  };

  const hasLocation = location?.coords?.latitude && location?.coords?.longitude && accuracyInMeters && !loading;

  return (
    <View style={styles.container}>
      <Map map={map} camera={camera} setLocation={setLocation} />

      <View style={[styles.bottom, {width: '100%'}]}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          {hasLocation ? <Button caption="" icon={Times} variant="primary" round onPress={handleDismiss} /> : null}
          {hasLocation ? (
            <View
              style={{
                backgroundColor: colors.khaki,
                flex: 0.9,
                height: 80,
                padding: 8,
                borderRadius: 4,
                justifyContent: 'space-between',
              }}
            >
              <Text style={{fontSize: 10}}>lat: {location?.coords?.latitude || 'N/A'}</Text>
              <Text style={{fontSize: 10}}>long: {location?.coords?.longitude || 'N/A'}</Text>
              <Text style={{fontSize: 10}}>
                accuracy: {accuracyInMeters ? Number(accuracyInMeters).toFixed(2) : 'N/A'}
              </Text>
            </View>
          ) : null}
          {hasLocation ? <Button caption="" icon={Check} variant="success" round onPress={handleSubmit} /> : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            initialMapCamera();
          }}
          style={[styles.myLocationIcon]}
          accessible
        >
          <Icon name="my-location" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.khaki,
  },
  bottom: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingBottom: 30,
    left: 0,
    bottom: 0,
    right: 0,
  },
  myLocationIcon: {
    width: 45,
    height: 45,
    backgroundColor: colors.khaki,
    position: 'absolute',
    borderRadius: 100,
    right: 0,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    bottom: 120,
  },
});
