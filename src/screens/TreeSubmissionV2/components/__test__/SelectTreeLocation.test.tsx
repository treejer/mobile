import {render} from '@testing-library/react-native';

import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {mapboxPrivateToken} from 'services/config';
import {colors} from 'constants/values';

describe('SelectTreeLocation component', () => {
  it('SelectTreeLocation component should be defined', () => {
    expect(SelectTreeLocation).toBeDefined();
    expect(typeof SelectTreeLocation).toBe('function');
  });

  describe('SelectTreeLocation state = not selected & empty', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(<SelectTreeLocation testID="select-location-cpt" onSelect={() => {}} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('select-location-cpt');
      const contentContainer = getElementByTestId('select-location-content');
      const textsContainer = getElementByTestId('select-tree-photo-text-container');
      const locationImage = queryElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');
      const removeBtn = queryElementByTestId('remove-location-button');
      const removeBtnText = queryElementByTestId('remove-location-text');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(contentContainer).toBeTruthy();
      expect(stylesToOneObject(contentContainer.props.style).backgroundColor).toBe(colors.khaki);

      expect(textsContainer).toBeTruthy();
      expect(stylesToOneObject(textsContainer.props.style).height).toBe(74);
      expect(stylesToOneObject(textsContainer.props.style).minWidth).toBe(178);
      expect(stylesToOneObject(textsContainer.props.style).backgroundColor).toBe('transparent');

      expect(locationImage).toBeFalsy();

      expect(locationText).toBeTruthy();
      expect(locationText.props.children).toBe('submitTreeV2.location');

      expect(locationDesc).toBeTruthy();
      expect(locationDesc.props.i18nKey).toBe('submitTreeV2.selectOnMap');

      expect(selectLocationBtn).toBeTruthy();
      expect(selectLocationBtn.props.accessibilityState.disabled).toBeFalsy();

      expect(mapText).toBeTruthy();
      expect(mapText.props.children).toBe('submitTreeV2.map');

      expect(locationIcon).toBeTruthy();
      expect(locationIcon.props.name).toBe('map-marked-alt');
      expect(locationIcon.props.color).toBe(colors.khaki);

      expect(removeBtn).toBeFalsy();
      expect(removeBtnText).toBeFalsy();
    });
  });

  describe('SelectTreeLocation state = has location can change', () => {
    let getElementByTestId;

    const hasLocation = {
      coords: {
        latitude: 35.7022048,
        longitude: 51.4517922,
      },
      canUpdate: true,
    };

    beforeEach(() => {
      const element = render(
        <SelectTreeLocation
          testID="select-location-cpt"
          hasLocation={hasLocation}
          onSelect={() => {}}
          onRemove={() => {}}
        />,
      );
      getElementByTestId = element.getByTestId;
    });

    const imageUrl = getStaticMapboxUrl(
      mapboxPrivateToken,
      hasLocation.coords.longitude,
      hasLocation.coords.latitude,
      600,
      300,
    );

    it('components/elements should be defined', () => {
      const container = getElementByTestId('select-location-cpt');
      const contentContainer = getElementByTestId('select-location-content');
      const textsContainer = getElementByTestId('select-tree-photo-text-container');
      const locationImage = getElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');
      const removeBtn = getElementByTestId('remove-location-button');
      const removeBtnText = getElementByTestId('remove-location-text');

      const checkIcon = getElementByTestId('check-icon');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(contentContainer).toBeTruthy();
      expect(stylesToOneObject(contentContainer.props.style).backgroundColor).toBe(colors.darkOpacity);

      expect(textsContainer).toBeTruthy();
      expect(stylesToOneObject(textsContainer.props.style).height).toBe(74);
      expect(stylesToOneObject(textsContainer.props.style).minWidth).toBe(178);
      expect(stylesToOneObject(textsContainer.props.style).backgroundColor).toBe(colors.khakiOpacity);

      expect(locationImage).toBeTruthy();
      expect(locationImage.props.source.uri).toBe(imageUrl);

      expect(locationText).toBeTruthy();
      expect(locationText.props.children).toBe('submitTreeV2.location');

      expect(checkIcon).toBeTruthy();
      expect(checkIcon.props.name).toBe('check-circle');
      expect(checkIcon.props.color).toBe(colors.green);

      expect(locationDesc).toBeTruthy();
      expect(locationDesc.props.i18nKey).toBe('submitTreeV2.SelectOnMapToChange');

      expect(selectLocationBtn).toBeTruthy();
      expect(selectLocationBtn.props.accessibilityState.disabled).toBeFalsy();

      expect(mapText).toBeTruthy();
      expect(mapText.props.children).toBe('submitTreeV2.map');

      expect(locationIcon).toBeTruthy();
      expect(locationIcon.props.name).toBe('map-marked-alt');
      expect(locationIcon.props.color).toBe(colors.khaki);

      expect(removeBtn).toBeTruthy();
      expect(removeBtnText).toBeTruthy();
      expect(removeBtnText.props.children).toBe('submitTreeV2.remove');
    });
  });

  describe("SelectTreeLocation state = has location can't change", () => {
    let getElementByTestId, queryElementByTestId;

    const hasLocation = {
      coords: {
        latitude: 35.7022048,
        longitude: 51.4517922,
      },
      canUpdate: false,
    };

    beforeEach(() => {
      const element = render(
        <SelectTreeLocation testID="select-location-cpt" hasLocation={hasLocation} onSelect={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    const imageUrl = getStaticMapboxUrl(
      mapboxPrivateToken,
      hasLocation.coords.longitude,
      hasLocation.coords.latitude,
      600,
      300,
    );

    it('components/elements should be defined', () => {
      const container = getElementByTestId('select-location-cpt');
      const contentContainer = getElementByTestId('select-location-content');
      const textsContainer = getElementByTestId('select-tree-photo-text-container');
      const locationImage = getElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');
      const removeBtn = queryElementByTestId('remove-location-button');
      const removeBtnText = queryElementByTestId('remove-location-text');

      const checkIcon = getElementByTestId('check-icon');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(contentContainer).toBeTruthy();
      expect(stylesToOneObject(contentContainer.props.style).backgroundColor).toBe(colors.darkOpacity);

      expect(textsContainer).toBeTruthy();
      expect(stylesToOneObject(textsContainer.props.style).height).toBe(74);
      expect(stylesToOneObject(textsContainer.props.style).minWidth).toBe(178);
      expect(stylesToOneObject(textsContainer.props.style).backgroundColor).toBe(colors.khakiOpacity);

      expect(locationImage).toBeTruthy();
      expect(locationImage.props.source.uri).toBe(imageUrl);

      expect(locationText).toBeTruthy();
      expect(locationText.props.children).toBe('submitTreeV2.location');

      expect(checkIcon).toBeTruthy();
      expect(checkIcon.props.name).toBe('check-circle');
      expect(checkIcon.props.color).toBe(colors.green);

      expect(locationDesc).toBeTruthy();
      expect(locationDesc.props.i18nKey).toBe('submitTreeV2.SelectOnMapToChange');

      expect(selectLocationBtn).toBeTruthy();
      expect(selectLocationBtn.props.accessibilityState.disabled).toBeTruthy();

      expect(mapText).toBeTruthy();
      expect(mapText.props.children).toBe('submitTreeV2.map');

      expect(locationIcon).toBeTruthy();
      expect(locationIcon.props.name).toBe('map-marked-alt');
      expect(locationIcon.props.color).toBe(colors.khaki);

      expect(removeBtn).toBeFalsy();
      expect(removeBtnText).toBeFalsy();
    });
  });
});
