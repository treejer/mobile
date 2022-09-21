# SelectPhoto screen

> Select photo step user must pick or take photo of tree, one of tree submission steps.

components:

- SelectPhoto: screen
  - [WebCam](../../../../components/WebCam): open camera and image cropper
  - [SubmitTreeOfflineWebModal](../../../../components/SubmitTreeOfflineWebModal): modal for submit tree when internet is not connect
  - [TreeSubmissionStepper](../../components/TreeSubmissionStepper): tree submission stepper
- [PickImageButton](./PickImageButton.tsx): pick image button on web and mobile application
  - [FileInput](../../../../components/FileInput): pick image button on web application
  - [SelectPhotoButton](./SelectPhotoButton.tsx): pick image button on mobile application
- [WebImagePickerCropper](./WebImagePickerCropper.tsx): picked image cropper
