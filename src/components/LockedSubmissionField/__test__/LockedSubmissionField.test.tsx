import {render} from '@testing-library/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {colors} from 'constants/values';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';

describe('LockedSubmissionField component', () => {
  it('LockedSubmissionField component to be defined', () => {
    expect(LockedSubmissionField).toBeDefined();
    expect(typeof LockedSubmissionField).toBe('function');
  });

  describe('LockedSubmissionField without icon, pass title and description', () => {
    let getElementByTestId;
    const title = 'Location';
    const description = 'Description';
    beforeEach(() => {
      const element = render(
        <LockedSubmissionField testID="locked-location" title={title} description={description} />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('locked-location');
      const titleText = getElementByTestId('locked-title');
      const descText = getElementByTestId('locked-desc');
      const lockedIcon = getElementByTestId('locked-icon');

      expect(stylesToOneObject(container.props.style).backgroundColor).toBe(colors.khakiDark);
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(titleText).toBeTruthy();
      expect(titleText.props.children).toBe(title);
      expect(descText).toBeTruthy();
      expect(descText.props.children).toBe(description);
      expect(lockedIcon.props.name).toBe('lock');
      expect(lockedIcon.props.color).toBe(colors.khakiDark);
    });
  });

  describe('LockedSubmissionField with icon (string), with default title and description', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<LockedSubmissionField testID="locked-location" icon="clock-o" />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('locked-location');
      const titleText = getElementByTestId('locked-title');
      const descText = getElementByTestId('locked-desc');
      const lockedIcon = getElementByTestId('locked-icon');

      expect(stylesToOneObject(container.props.style).backgroundColor).toBe(colors.khakiDark);
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(titleText).toBeTruthy();
      expect(titleText.props.children).toBe('lockedField.defTitle');
      expect(descText).toBeTruthy();
      expect(descText.props.children).toBe('lockedField.defDesc');
      expect(lockedIcon.props.name).toBe('clock-o');
      expect(lockedIcon.props.color).toBe(colors.khakiDark);
    });
  });

  describe('LockedSubmissionField with icon (component)', () => {
    let getElementByTestId;

    const IconCpt = <Icon testID="locked-icon" name="lock" color={colors.khakiDark} />;
    beforeEach(() => {
      const element = render(<LockedSubmissionField testID="locked-location" icon={IconCpt} />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('locked-location');
      const titleText = getElementByTestId('locked-title');
      const descText = getElementByTestId('locked-desc');
      const lockedIcon = getElementByTestId('locked-icon');

      expect(stylesToOneObject(container.props.style).backgroundColor).toBe(colors.khakiDark);
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(titleText).toBeTruthy();
      expect(titleText.props.children).toBe('lockedField.defTitle');
      expect(descText).toBeTruthy();
      expect(descText.props.children).toBe('lockedField.defDesc');
      expect(lockedIcon.props.name).toBe('lock');
      expect(lockedIcon.props.color).toBe(colors.khakiDark);
    });
  });
});
