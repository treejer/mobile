import Button from 'components/Button';
import {render} from '@testing-library/react-native';
import Tree from 'components/Icons/Tree';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';

describe('Button component', () => {
  it('Button component should be defined', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });

  describe('elements/components should be defined', () => {
    it('Button without icon', () => {
      let getElementByTestId, queryElementByTestId;
      const caption = 'Hello world';
      const element = render(<Button testID="container" caption={caption} onPress={() => {}} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const iconLeft = queryElementByTestId('icon-left');
      const iconRight = queryElementByTestId('icon-right');

      expect(iconLeft).toBeFalsy();
      expect(iconRight).toBeFalsy();

      const captionText = getElementByTestId('caption-text');
      expect(caption).toBeTruthy();
      expect(captionText.props.children).toBe(caption);
    });

    it('Button with icon, placement left', () => {
      let getElementByTestId;
      const caption = 'Hello world';
      const element = render(
        <Button testID="container" caption={caption} onPress={() => {}} icon={Tree} iconPlace="left" />,
      );
      getElementByTestId = element.getByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const icon = getElementByTestId('icon-left');
      const captionText = getElementByTestId('caption-text');
      expect(icon).toBeTruthy();
      expect(caption).toBeTruthy();
      expect(captionText.props.children).toBe(caption);
    });

    it('Button with icon, placement right', () => {
      let getElementByTestId;
      const caption = 'Hello world';
      const element = render(
        <Button testID="container" caption={caption} onPress={() => {}} icon={Tree} iconPlace="right" />,
      );
      getElementByTestId = element.getByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const icon = getElementByTestId('icon-right');
      const captionText = getElementByTestId('caption-text');
      expect(icon).toBeTruthy();
      expect(caption).toBeTruthy();
      expect(captionText.props.children).toBe(caption);
    });

    it('Button with round prop', () => {
      let getElementByTestId, queryElementByTestId;
      const caption = 'Hello world';
      const element = render(<Button testID="container" onPress={() => {}} round icon={Tree} caption={caption} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const icon = getElementByTestId('icon-right');
      const captionText = queryElementByTestId('caption-text');
      expect(icon).toBeTruthy();
      expect(captionText).toBeFalsy();
    });

    it('Button loading = true', () => {
      let getElementByTestId;
      const caption = 'Hello world';
      const element = render(
        <Button testID="container" caption={caption} onPress={() => {}} icon={Tree} iconPlace="left" loading={true} />,
      );
      getElementByTestId = element.getByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const icon = getElementByTestId('icon-left');
      const captionText = getElementByTestId('caption-text');
      const loading = getElementByTestId('loading-indicator');

      expect(icon).toBeTruthy();
      expect(caption).toBeTruthy();
      expect(captionText.props.children).toBe(caption);
      expect(loading).toBeTruthy();
    });

    it('Button disabled = true', () => {
      let getElementByTestId;
      const caption = 'Hello world';
      const element = render(
        <Button testID="container" caption={caption} onPress={() => {}} icon={Tree} iconPlace="left" disabled={true} />,
      );
      getElementByTestId = element.getByTestId;

      const container = getElementByTestId('container');
      expect(container).toBeTruthy();

      const icon = getElementByTestId('icon-left');
      const captionText = getElementByTestId('caption-text');

      expect(icon).toBeTruthy();
      expect(caption).toBeTruthy();
      expect(captionText.props.children).toBe(caption);
    });

    it('Button size = sm', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button caption={caption} size="sm" />);
      getElementByTestId = element.getByTestId;

      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(12);
    });

    it('Button size = lg', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button caption={caption} size="lg" />);
      getElementByTestId = element.getByTestId;

      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(14);
    });
  });

  describe('different variant', () => {
    it('primary', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button testID="button" caption={caption} variant="primary" icon={Tree} />);
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe(colors.khakiDark);
      expect(stylesToOneObject(btn.props.style).borderColor).toBe('#BDBDBD');
      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(14);
      expect(stylesToOneObject(captionText.props.style).color).toBe(colors.grayDarker);
    });
    it('cta', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button testID="button" caption={caption} variant="cta" icon={Tree} />);
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe('white');
      expect(stylesToOneObject(captionText.props.style).color).toBe(colors.grayDarker);
    });
    it('secondary', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button testID="button" caption={caption} variant="secondary" icon={Tree} />);
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe(colors.grayDarker);
      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(14);
      expect(stylesToOneObject(captionText.props.style).color).toBe('white');
    });
    it('success', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button testID="button" caption={caption} variant="success" icon={Tree} />);
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe(colors.green);
      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(14);
      expect(stylesToOneObject(captionText.props.style).color).toBe('white');
    });
    it('tertiary', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(<Button testID="button" caption={caption} variant="tertiary" icon={Tree} />);
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');

      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe('white');
      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(16);
      expect(stylesToOneObject(captionText.props.style).color).toBe(colors.grayDarker);
    });
    it('tertiary loading = true', () => {
      let getElementByTestId;
      const caption = 'hello world';
      const element = render(
        <Button testID="button" caption={caption} variant="tertiary" icon={Tree} loading={true} />,
      );
      getElementByTestId = element.getByTestId;

      const btn = getElementByTestId('button');
      const captionText = getElementByTestId('caption-text');
      const loading = getElementByTestId('loading-indicator');

      expect(loading.props.color).toBe(colors.grayDarker);
      expect(stylesToOneObject(btn.props.style).backgroundColor).toBe('white');
      expect(stylesToOneObject(captionText.props.style).fontSize).toBe(16);
      expect(stylesToOneObject(captionText.props.style).color).toBe(colors.grayDarker);
    });
  });
});
