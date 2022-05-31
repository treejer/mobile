import FileInput from 'components/FileInput/FileInput';
import React from 'react';
import {isWeb} from 'utilities/helpers/web';
import SelectPhotoButton, {SelectPhotoButtonPropsType} from './SelectPhotoButton';

interface PickImageButton extends SelectPhotoButtonPropsType {}

export function PickImageButton(props: PickImageButton) {
  if (isWeb()) {
    return <FileInput {...props} />;
  } else {
    return <SelectPhotoButton {...props} />;
  }
}
