import Button from 'components/Button';

export type TOpenSettingsButtonProps = {
  caption: string;
  onPress: () => void | Promise<void> | undefined;
};

export function OpenSettingsButton(props: TOpenSettingsButtonProps) {
  const {caption, onPress} = props;

  return <Button testID="open-setting-btn" variant="secondary" caption={caption} onPress={onPress} />;
}
