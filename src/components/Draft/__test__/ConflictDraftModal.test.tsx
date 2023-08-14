import {render} from '@testing-library/react-native';

import {ConflictDraftModal} from 'components/Draft/ConflictDraftModal';

describe('ConflictDraftModal component', () => {
  it('ConflictDraftModal component should be defined', () => {
    expect(ConflictDraftModal).toBeDefined();
    expect(typeof ConflictDraftModal).toBe('function');
  });

  describe('ConflictDraftModal', () => {
    let getElementByTestId;

    beforeEach(() => {
      const element = render(<ConflictDraftModal onCancel={() => {}} onAccept={() => {}} />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const title = getElementByTestId('conflict-draft-title');
      const desc = getElementByTestId('conflict-draft-message');
      const cancelBtn = getElementByTestId('cancel-btn');
      const cancelBtnText = getElementByTestId('cancel-btn-text');
      const acceptBtn = getElementByTestId('accept-btn');
      const acceptBtnText = getElementByTestId('accept-btn-text');

      expect(title).toBeTruthy();
      expect(title.props.children).toBe('conflictDraftModal.title');

      expect(desc).toBeTruthy();
      expect(desc.props.children).toBe('conflictDraftModal.description');

      expect(cancelBtn).toBeTruthy();
      expect(cancelBtnText).toBeTruthy();
      expect(cancelBtnText.props.children).toBe('cancel');

      expect(acceptBtn).toBeTruthy();
      expect(acceptBtnText).toBeTruthy();
      expect(acceptBtnText.props.children).toBe('accept');
    });
  });
});
