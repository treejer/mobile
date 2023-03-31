import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {render} from '@testing-library/react-native';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {mapboxPrivateToken} from 'services/config';

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
      const locationImage = queryElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).backgroundColor).toBe(colors.khaki);
      expect(stylesToOneObject(container.props.style).height).toBe(104);

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
        <SelectTreeLocation testID="select-location-cpt" hasLocation={hasLocation} onSelect={() => {}} />,
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
      const locationImage = getElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).backgroundColor).toBe('transparent');
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(locationImage).toBeTruthy();
      expect(locationImage.props.source.uri).toBe(imageUrl);

      expect(locationText).toBeTruthy();
      expect(locationText.props.children).toBe('submitTreeV2.location');

      expect(locationDesc).toBeTruthy();
      expect(locationDesc.props.i18nKey).toBe('submitTreeV2.SelectOnMapToChange');

      expect(selectLocationBtn).toBeTruthy();
      expect(selectLocationBtn.props.accessibilityState.disabled).toBeFalsy();

      expect(mapText).toBeTruthy();
      expect(mapText.props.children).toBe('submitTreeV2.map');

      expect(locationIcon).toBeTruthy();
      expect(locationIcon.props.name).toBe('map-marked-alt');
      expect(locationIcon.props.color).toBe(colors.khaki);
    });
  });

  describe("SelectTreeLocation state = has location can't change", () => {
    let getElementByTestId;

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
      const locationImage = getElementByTestId('select-location-image');
      const locationText = getElementByTestId('select-location-title');
      const locationDesc = getElementByTestId('select-location-desc');
      const mapText = getElementByTestId('select-location-map');
      const locationIcon = getElementByTestId('select-location-icon');
      const selectLocationBtn = getElementByTestId('select-location-button');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).backgroundColor).toBe('transparent');
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(locationImage).toBeTruthy();
      expect(locationImage.props.source.uri).toBe(imageUrl);

      expect(locationText).toBeTruthy();
      expect(locationText.props.children).toBe('submitTreeV2.location');

      expect(locationDesc).toBeTruthy();
      expect(locationDesc.props.i18nKey).toBe('submitTreeV2.SelectOnMapToChange');

      expect(selectLocationBtn).toBeTruthy();
      expect(selectLocationBtn.props.accessibilityState.disabled).toBeTruthy();

      expect(mapText).toBeTruthy();
      expect(mapText.props.children).toBe('submitTreeV2.map');

      expect(locationIcon).toBeTruthy();
      expect(locationIcon.props.name).toBe('map-marked-alt');
      expect(locationIcon.props.color).toBe(colors.khaki);
    });
  });
});
