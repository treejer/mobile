import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

const useCamera = () => {
  const {t} = useTranslation();

  const openLibrary = useCallback(async () => {}, []);

  const openCamera = useCallback(async (options): Promise<void> => {}, []);

  return {openCameraHook: openCamera, openLibraryHook: openLibrary};
};

export default useCamera;
