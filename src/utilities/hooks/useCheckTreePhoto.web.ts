import {calcDistance, TPoint} from 'utilities/helpers/distance';
import {useCallback} from 'react';
import exifr from 'exifr';
import {TUserLocation} from './usePlantTreePermissions';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTranslation} from 'react-i18next';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();

  const checkPickedPhoto = useCallback(
    async (image64Base: string, userLocation: TUserLocation, successCallback: () => void) => {
      const {latitude, longitude} = (await exifr.parse(image64Base)) || {};
      if (latitude > 0 && longitude > 0) {
        let maxDistance = 5;
        if (userLocation) {
          const imageCoords: TPoint = {
            latitude,
            longitude,
          };
          const distance = calcDistance(imageCoords, userLocation);
          console.log({userLocation, imageCoords, distance});
          if (distance < maxDistance) {
            successCallback();
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
      }
    },
    [t],
  );

  return checkPickedPhoto;
};
