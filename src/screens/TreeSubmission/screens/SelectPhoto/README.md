# SelectPhoto screen

> SelectPhoto screen will show pick image buttons, one of tree submission steps.

components:

- SelectPhoto: screen
  - [WebCam](../../../../components/WebCam): open camera and image cropper
  - [SubmitTreeOfflineWebModal](../../../../components/SubmitTreeOfflineWebModal): modal for submit tree when internet is not connect
  - [TreeSubmissionStepper](../../components/TreeSubmissionStepper): tree submission stepper
- PickImageButton: pick image button on web and mobile application
  - [FileInput](../../../../components/FileInput): pick image button on web application
  - SelectPhotoButton: pick image button on mobile application
- SelectPhotoButton: pick Image button
- WebImagePickerCropper: picked image cropper
