import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TFunction, useTranslation} from 'react-i18next';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useAppState} from 'utilities/hooks/useAppState';
import {TUsePlantTreePermissions, TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';

export const getCurrentPositionAsyncWeb = (t: TFunction<'translation', undefined>) => {
  return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const {latitude, longitude} = position.coords;

          if (latitude == null || longitude == null) {
            console.log('err lat nad long = null');
            reject('err lat nad long = null');
          } else {
            resolve(position.coords);
          }
        },
        function (err) {
          console.log(err, 'error is here');
          reject(err);
        },
        {maximumAge: 999999999, timeout: 6000, enableHighAccuracy: true},
      );
    } else {
      reject(t('checkPermission.error.cantSupportGeo'));
    }
  });
};

export function usePlantTreePermissions(): TUsePlantTreePermissions {
  const {appState} = useAppState();

  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<TUserLocation | null>(null);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const {t} = useTranslation();

  useEffect(() => {
    console.log({userLocation, locationPermission, cameraPermission}, 'userLocation is here');
  }, [cameraPermission, locationPermission, userLocation]);

  useEffect(() => {
    (async () => {
      try {
        intervalRef.current = setInterval(async () => {
          await checkPermission();
        }, 5000);
      } catch (err) {
        showAlert({
          title: 'Error',
          message: String(err),
          mode: AlertMode.Error,
        });
      }
    })();

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
      } catch (e) {
        console.log(e, 'e inside useEffect AppState change usePlantTreePermissoin web');
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useRefocusEffect(() => {
    (async () => {
      try {
        await checkPermission();
      } catch (err) {
        setUserLocation({latitude: 0, longitude: 0});
        setLocationPermission('blocked');
      }
    })();
  });

  const watchCurrentPositionAsyncWeb = useCallback(async () => {
    return new Promise<GeolocationPosition['coords']>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setUserLocation({latitude, longitude});
            resolve(position.coords);
          },
          err => {
            setUserLocation({latitude: 0, longitude: 0});
            reject(err);
          },
          {
            maximumAge: 9999999999,
            timeout: 6000,
            enableHighAccuracy: true,
          },
        );
      } else {
        reject(t('checkPermission.error.cantSupportGeo'));
      }
    });
  }, [t]);

  const checkUserLocation = useCallback(async () => {
    try {
      const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
      if (userLocation?.latitude !== latitude || userLocation.longitude === longitude) {
        setUserLocation({
          latitude,
          longitude,
        });
      }
      setLocationPermission('granted');
    } catch (error: any) {
      showAlert({
        title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
        message: error.code
          ? t(`checkPermission.error.${error.code}`, {message: error.message})
          : t('checkPermission.error.unknownError'),
        mode: AlertMode.Info,
      });
      setUserLocation({latitude: 0, longitude: 0});
      setLocationPermission('blocked');
    }
  }, [t, userLocation]);

  const checkPermission = useCallback(async () => {
    navigator.mediaDevices
      .getUserMedia({audio: false, video: true})
      .then(result => {
        if (result.active) {
          setCameraPermission('granted');
        }
      })
      .catch(error => {
        console.log(error, 'error');
        showAlert({
          title: t('checkPermission.error.deviceNotFound'),
          message: String(error),
          mode: AlertMode.Error,
        });
        setCameraPermission('blocked');
      });
    navigator.permissions
      // @ts-ignore
      .query({name: 'camera'})
      .then(({state}) => {
        setCameraPermission(state === 'granted' ? state : 'blocked');
      })
      .catch(err => {
        console.log(err, 'error request permissions web');
      });
    getCurrentPositionAsyncWeb(t)
      .then(({latitude, longitude}) => {
        setUserLocation({
          latitude,
          longitude,
        });
      })
      .catch(() => {
        setUserLocation({latitude: 0, longitude: 0});
        setLocationPermission('blocked');
      });
    setLocationPermission('granted');
    navigator.permissions
      .query({name: 'geolocation'})
      .then(async ({state}) => {
        setLocationPermission(state === 'granted' ? state : 'blocked');
        if (state === 'granted') {
          await checkUserLocation();
        } else {
          setUserLocation({
            latitude: 0,
            longitude: 0,
          });
        }
      })
      .catch(err => {
        console.log(err, 'error request permissions web');
      });

    setChecked(true);
  }, [checkUserLocation, t]);

  const requestPermission = useCallback(async () => {
    try {
      await checkPermission();
      navigator.mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(result => {
          if (result.active) {
            setCameraPermission('granted');
          }
        })
        .catch(e => {
          setCameraPermission('blocked');
        });
      const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
      setUserLocation({
        latitude,
        longitude,
      });
    } catch (err) {
      console.log(err);
    }
    setRequested(true);
  }, [checkPermission, t]);

  const watchUserLocation = useCallback(async () => {
    try {
      await watchCurrentPositionAsyncWeb();
    } catch (error) {
      console.log(error);
    }
  }, [watchCurrentPositionAsyncWeb]);

  const requestCameraPermission = useCallback(
    (isGranted?: boolean) => {
      if (isGranted) {
        return;
      }
      navigator.mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(result => {
          if (result.active) {
            setCameraPermission('granted');
          }
        })
        .catch(error => {
          console.log(error, 'error');
          showAlert({
            title: t('checkPermission.error.deviceNotFound'),
            message: String(error),
            mode: AlertMode.Error,
          });
          setCameraPermission('blocked');
        });
    },
    [t],
  );

  const requestLocationPermission = useCallback(
    async (isGranted?: boolean) => {
      try {
        if (isGranted) {
          return;
        }
        const state = (await navigator.permissions.query({name: 'geolocation'})).state;
        if (state === 'granted') {
          const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
          setLocationPermission('granted');
          setUserLocation({
            latitude,
            longitude,
          });
        } else {
          showAlert({
            title: t('checkPermission.error.siteSettings'),
            message: t('checkPermission.error.turnOnGPS'),
            mode: AlertMode.Info,
          });
        }
      } catch (error: any) {
        showAlert({
          title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
          message: error.code
            ? t(`checkPermission.error.${error.code}`, {message: error.message})
            : t('checkPermission.error.unknownError'),
          mode: AlertMode.Info,
        });
        setLocationPermission('blocked');
        setUserLocation({
          latitude: 0,
          longitude: 0,
        });
      }
    },
    [t],
  );

  const openGpsRequest = useCallback(
    async (isGranted?: boolean) => {
      if (isGranted) {
        return;
      }
      try {
        const state = (await navigator.permissions.query({name: 'geolocation'})).state;
        if (state !== 'granted') {
          throw {code: 1, message: 'geolcaiton denied'};
        }
        setLocationPermission('granted');
        await checkUserLocation();
      } catch (error: any) {
        console.log(error, 'errirrrrsrseresrseresres');
        showAlert({
          title: error.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
          message: error.code
            ? t(`checkPermission.error.${error.code}`, {message: error.message})
            : t('checkPermission.error.unknownError'),
          mode: AlertMode.Info,
        });
      }
    },
    [checkUserLocation, t],
  );

  const isCameraBlocked = useMemo(() => cameraPermission === 'blocked', [cameraPermission]);
  const isLocationBlocked = useMemo(() => locationPermission === 'blocked', [locationPermission]);

  const isCameraGranted = useMemo(() => cameraPermission === 'granted', [cameraPermission]);
  // const isCameraGranted = useMemo(() => true, []);
  const isLocationGranted = useMemo(() => locationPermission === 'granted', [locationPermission]);
  const hasLocation = useMemo(() => !!(userLocation?.latitude && userLocation?.longitude), [userLocation]);

  const isGranted = useMemo(
    () => isCameraGranted && isLocationGranted && hasLocation,
    [hasLocation, isCameraGranted, isLocationGranted],
  );

  const isGPSEnabled = useMemo(() => !!userLocation, [userLocation]);

  const isChecking = useMemo(() => {
    return !checked && (!cameraPermission || !locationPermission);
  }, [checked, cameraPermission, locationPermission]);

  const cantProceed = useMemo(
    () => checked && (isCameraBlocked || isLocationBlocked || (isGPSEnabled && !hasLocation)),
    [checked, hasLocation, isCameraBlocked, isGPSEnabled, isLocationBlocked],
  );

  return {
    cameraPermission,
    locationPermission,
    userLocation,
    checkPermission,
    checkUserLocation,
    requestPermission,
    openPermissionsSettings: () => {},
    openGpsRequest,
    requestCameraPermission,
    requestLocationPermission,
    isCameraBlocked,
    isLocationBlocked,
    isCameraGranted,
    isLocationGranted,
    isGPSEnabled,
    hasLocation,
    isChecking,
    cantProceed,
    requested,
    isGranted,
  };
}
