import {TPoint} from 'utilities/helpers/distanceInMeters';
import {useCallback} from 'react';
import exifr from 'exifr';
import {TUserLocation} from './usePlantTreePermissions';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTranslation} from 'react-i18next';
import {useBrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {maxDistanceInKiloMeters} from 'services/config';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();
  const browserPlatform = useBrowserPlatform();

  return useCallback(
    async (
      image64Base: string,
      userLocation: TUserLocation,
      successCallback: (imageLocation?: TUserLocation) => void,
      imageLocation: TUserLocation,
    ) => {
      try {
        if (browserPlatform === 'iOS') {
          successCallback();
          return;
        }
        const {latitude, longitude, ...exif} = await exifr.parse(image64Base);
        console.log({exif, latitude, longitude}, 'cordinates');
        if (latitude > 0 && longitude > 0) {
          if (userLocation) {
            const imageCoords: TPoint = {
              latitude,
              longitude,
            };
            const distance = calcDistanceInMeters(imageCoords, userLocation);
            const distanceInKiloMeters = distance / 1000;
            console.log({userLocation, imageCoords, distance});
            if (distanceInKiloMeters < maxDistanceInKiloMeters) {
              successCallback(imageCoords);
            } else {
              showAlert({
                title: t('inValidImage.title'),
                mode: AlertMode.Error,
                message: t('inValidImage.longDistance'),
              });
            }
          } else {
            showAlert({
              title: t('inValidImage.title'),
              mode: AlertMode.Error,
              message: t('inValidImage.hasNoLocation'),
            });
          }
        } else {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.hasNoLocation'),
          });
        }
      } catch (error) {
        showAlert({
          title: t('inValidImage.title'),
          mode: AlertMode.Error,
          message: t('inValidImage.hasNoLocation'),
        });
      }
    },
    [browserPlatform, t],
  );
};
