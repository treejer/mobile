import {ChangeSettingsAlert} from 'screens/TreeSubmissionV2/components/ChangeSettingsAlert/ChangeSettingsAlert';
import {render} from '@testing-library/react-native';

describe('ChangeSettingsAlert component', () => {
  it('ChangeSettingsAlert should be defined', () => {
    expect(ChangeSettingsAlert).toBeDefined();
    expect(typeof ChangeSettingsAlert).toBe('function');
  });

  describe('ChangeSettingsAlert', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <ChangeSettingsAlert testID="change-settings-alert-cpt" onApprove={() => {}} onReject={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
    });
    it('components/elements should be defined', () => {
      const title = getElementByTestId('change-settings-alert-title');
      const rejectBtn = getElementByTestId('reject-btn');
      const rejectBtnText = getElementByTestId('reject-btn-text');
      const approveBtn = getElementByTestId('approve-btn');
      const approveBtnText = getElementByTestId('approve-btn-text');

      expect(title).toBeTruthy();
      expect(title.props.children).toBe('submitTreeV2.titles.changeSettings');
      expect(rejectBtn).toBeTruthy();
      expect(rejectBtnText).toBeTruthy();
      expect(rejectBtnText.props.children).toBe('reject');
      expect(approveBtn).toBeTruthy();
      expect(approveBtnText).toBeTruthy();
      expect(approveBtnText.props.children).toBe('approve');
    });
  });
});
