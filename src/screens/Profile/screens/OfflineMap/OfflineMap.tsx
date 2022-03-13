import MapboxGL from '@react-native-mapbox-gl/maps';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import {createOfflineMap, getAllOfflineMaps, getAreaName} from 'utilities/helpers/maps';
import {locationPermission} from 'utilities/helpers/permissions';
import Map from 'components/Map';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Button from 'components/Button';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import Spacer from 'components/Spacer';
import {ChevronLeft} from 'components/Icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

const OfflineMap = ({navigation}) => {
  const [isLoaderShow, setIsLoaderShow] = useState(false);
  const [areaName, setAreaName] = useState('');
  const [numberOfOfflineMaps, setNumberOfOfflineMaps] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isPermissionBlockedAlertShow, setIsPermissionBlockedAlertShow] = useState(false);
  const isConnected = useNetInfoConnected();
  const {t} = useTranslation();

  const MapBoxGLRef = useRef();
  const camera = useRef();

  const getAllOfflineMapsLocal = useCallback(() => {
    getAllOfflineMaps()
      .then(offlineMaps => {
        setNumberOfOfflineMaps(offlineMaps.length);
        initialMapCamera();
      })
      .catch(e => {
        console.log(e, 'e inside getAllOfflineMapsLocal');
      });
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAllOfflineMapsLocal();
    });
  }, [getAllOfflineMapsLocal, navigation]);

  const initialMapCamera = () => {
    locationPermission()
      .then(() => {
        Geolocation.getCurrentPosition(
          position => {
            if (camera?.current?.setCamera) {
              camera.current?.setCamera({
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
          setIsPermissionBlockedAlertShow(true);
        }
      });
  };

  const zoomLevelChanged = async () => {
    if (MapBoxGLRef?.current) {
      setZoomLevel(await MapBoxGLRef?.current?.getZoom());
    }
  };

  const onPressDownloadArea = async () => {
    const offlineMapId = `TreeMapper-offline-map-id-${Date.now()}`;
    if (isConnected) {
      setIsLoaderShow(true);
      const coords = await MapBoxGLRef?.current.getCenter();
      const bounds = await MapBoxGLRef?.current.getVisibleBounds();
      getAreaName({coords})
        .then(async areaName => {
          setAreaName(areaName);
          const progressListener = (offlineRegion, status) => {
            if (status.percentage == 100) {
              createOfflineMap({
                name: offlineMapId,
                size: status.completedTileSize,
                areaName,
              })
                .then(() => {
                  setIsLoaderShow(false);
                  setTimeout(() => Alert.alert(t('offlineMap.downloaded')), 1000);
                  getAllOfflineMapsLocal();
                  setAreaName('');
                })
                .catch(err => {
                  console.log({
                    logType: 'other',
                    message: 'Error while creating Offline Map',
                    logStack: JSON.stringify(err),
                  });
                  setIsLoaderShow(false);
                  setAreaName('');
                  Alert.alert(t('offlineMap.isDownloaded'));
                });
            }
          };
          const errorListener = (offlineRegion, err) => {
            if (err.message !== 'timeout') {
              setIsLoaderShow(false);
              setAreaName('');
              Alert.alert(err.message);
            }
          };
          await MapboxGL.offlineManager.createPack(
            {
              name: offlineMapId,
              styleURL: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
              minZoom: 14,
              maxZoom: 20,
              bounds: bounds,
            },
            progressListener,
            errorListener,
          );
        })
        .catch(err => {
          console.log({
            logType: 'other',
            message: 'Error while getting area name',
            logStack: JSON.stringify(err),
          });
          setIsLoaderShow(false);
          setAreaName('');
          Alert.alert(t('offlineMap.failed'));
        });
    }
  };

  const renderLoaderModal = () => {
    return (
      <Modal transparent visible={isLoaderShow}>
        <View style={styles.dowloadModalContainer}>
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={colors.green} style={styles.loader} />
            <Text style={styles.areaName}>{areaName}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  const onPressViewAll = useCallback(() => {
    navigation.navigate('SavedAreas');
  }, []);

  return (
    <SafeAreaView style={[styles.mainContainer, globalStyles.screenViewBottom]}>
      <View style={styles.container}>
        <Spacer times={2} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={[globalStyles.pv1, globalStyles.pr1]} onPress={() => navigation.goBack()}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text style={[globalStyles.h5, globalStyles.textCenter, {marginHorizontal: 24}]}>
            {t('offlineMap.downloadArea')}
          </Text>
        </View>
        <View style={styles.mapViewContainer}>
          <Map
            onDidFinishRenderingMapFully={initialMapCamera}
            onWillStartRenderingFrame={zoomLevelChanged}
            ref={MapBoxGLRef}
            style={styles.cont}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.77]}
          >
            <MapboxGL.UserLocation showsUserHeadingIndicator />
            <MapboxGL.Camera ref={camera} />
          </Map>
          <TouchableOpacity
            onPress={() => {
              initialMapCamera();
            }}
            style={[styles.myLocationIcon]}
            accessible
          >
            <View style={Platform.OS === 'ios' && styles.myLocationIconContainer}>
              <Icon name="my-location" size={24} />
            </View>
          </TouchableOpacity>
        </View>
        {numberOfOfflineMaps == 0 ? (
          <Button
            style={{alignItems: 'center', justifyContent: 'center'}}
            variant="success"
            disabled={zoomLevel < 11}
            onPress={onPressDownloadArea}
            caption={t('offlineMap.download')}
          />
        ) : (
          <View style={styles.bottomBtnsContainer}>
            <Button onPress={onPressViewAll} caption={t('offlineMap.viewAll')} />
            <Button
              variant="success"
              disabled={zoomLevel < 11}
              onPress={onPressDownloadArea}
              caption={t('offlineMap.download')}
            />
          </View>
        )}
      </View>
      {isPermissionBlockedAlertShow && <Text>{t('offlineMap.permissionBlocked')}</Text>}
      {renderLoaderModal()}
    </SafeAreaView>
  );
};
export default OfflineMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.khaki,
  },
  cont: {flex: 1},
  mapViewContainer: {
    flex: 1,
    backgroundColor: colors.khaki,
    overflow: 'hidden',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: colors.green,
  },
  fakeMarkerCont: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaName: {
    fontSize: 16,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.khaki,
  },
  dowloadModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    backgroundColor: colors.khaki,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  loader: {
    backgroundColor: colors.khaki,
    borderRadius: 20,
    marginVertical: 20,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerImage: {
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
  },
  addSpecies: {
    color: colors.red,
    ...globalStyles.body2,
    textAlign: 'center',
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
    bottom: 25,
  },
  myLocationIconContainer: {
    top: 1.5,
    left: 0.8,
  },
});
