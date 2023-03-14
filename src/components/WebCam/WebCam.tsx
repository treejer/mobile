import React from 'react';

interface WebCamProps {
  handleDone: (image: string, croppedAreaPixels: number | null, rotation: number) => void;
  handleDismiss: () => void;
  aspect?: number;
}

function WebCam(props: WebCamProps) {
  return <></>;
}

export default WebCam;
