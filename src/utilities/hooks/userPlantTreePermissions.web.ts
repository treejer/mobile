export function usePlantTreejerPermissions() {
  return {
    cameraPermission: 'unavailable',
    locationPermission: 'unavailable',
    checkPermission: () => {},
    requestPermission: () => {},
    isCameraBlocked: false,
    isLocationBlocked: false,
    isCameraGranted: false,
    isLocationGranted: false,
  };
}
