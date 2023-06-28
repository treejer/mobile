import React from 'react';

interface WebCamProps {
  testID?: string;
  handleDone: (image: string, croppedAreaPixels: number | null, rotation: number) => void;
  handleDismiss: () => void;
  aspect?: number;
}

function WebCam(props: WebCamProps) {
  return <></>;
}

export default WebCam;
