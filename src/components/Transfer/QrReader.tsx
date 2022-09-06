import React, {useMemo, useRef} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Camera, CameraDeviceFormat, useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

function getMaxFps(format: CameraDeviceFormat): number {
  return format.frameRateRanges.reduce((prev, curr) => {
    if (curr.maxFrameRate > prev) return curr.maxFrameRate;
    else return prev;
  }, 0);
}

export function QrReader() {
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  // Alternatively you can use the underlying function:
  //
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //   runOnJS(setBarcodes)(detectedBarcodes);
  // }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  return (
    <Modal>
      {device != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            ref={cameraRef}
            isActive={true}
            //@ts-ignore
            device={device.back}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          {barcodes.map((barcode, idx) => (
            <Text key={idx} style={styles.barcodeTextURL}>
              {barcode.displayValue}
            </Text>
          ))}
        </>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
