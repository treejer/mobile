export function usePlantTreePermissions() {
  return {
    cameraPermission: 'unavailable',
    locationPermission: 'unavailable',
    libraryPermission: 'unavailable',
    checkPermission: () => {},
    requestPermission: () => {},
    isCameraBlocked: false,
    isLocationBlocked: false,
    isLibraryBlocked: false,
    isCameraGranted: false,
    isLocationGranted: false,
    isLibraryGranted: false,
    isChecking: false,
    cantProceed: false,
    requested: false,
  };
}
