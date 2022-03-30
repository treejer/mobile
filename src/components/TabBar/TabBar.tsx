import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import {BottomTabBarProps, BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import {GreenBlock, Tree, User} from '../Icons';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {analyticsTabEvents} from 'navigation';

interface Props extends BottomTabBarProps {}

function TabBar({state, descriptors, navigation}: Props) {
  const {sendEvent} = useAnalytics();

  return (
    <View
      style={[
        styles.wrapper,
        globalStyles.horizontalStack,
        globalStyles.justifyContentEvenly,
        globalStyles.alignItemsCenter,
      ]}
    >
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            sendEvent(analyticsTabEvents[route.name]);
            navigation.reset({
              index: 0,
              routes: [{name: route.name, params: {initialRouteName: 'SelectPlantType'}}],
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return renderTabItem({
          isFocused,
          // @ts-ignore
          onLongPress,
          // @ts-ignore
          onPress,
          options,
          index,
        });
      })}
    </View>
  );
}

interface RenderTabItemProps {
  isFocused: boolean;
  onLongPress: Pick<TouchableOpacityProps, 'onLongPress'>;
  onPress: Pick<TouchableOpacityProps, 'onPress'>;
  options: BottomTabNavigationOptions;
  index: number;
}

function renderTabItem({isFocused, onLongPress, onPress, options, index}: RenderTabItemProps) {
  console.log(isFocused, 'isFocused', index);
  switch (index) {
    case 0:
    case 2:
      return (
        // @ts-ignore
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.button}
          hitSlop={{top: 32, right: 32, bottom: 32, left: 32}}
          key={index}
        >
          {React.createElement(index === 0 ? User : GreenBlock, {
            fill: isFocused,
          })}
        </TouchableOpacity>
      );
    case 1:
      return (
        <View key={index} style={styles.middleTabWrapper}>
          {renderCirclePath(false)}
          <View style={styles.middleButtonWrapper}>
            {/* @ts-ignore */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.middleButton}
            >
              <Tree size={32} />
            </TouchableOpacity>
          </View>
          {renderCirclePath(true)}
        </View>
      );
    default:
      return null;
  }
}

function renderCirclePath(flip = false) {
  return (
    <Svg
      width="25"
      height="64"
      viewBox="0 0 25 56"
      fill="none"
      style={{
        [flip ? 'marginLeft' : 'marginRight']: -4,
        transform: flip ? [{scaleX: -1}] : [],
      }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.2048e-06 30.9317L1.20184e-06 30.9996L24 30.9996L24 14.8594C19.5398 23.8599 10.5435 30.2136 1.2048e-06 30.9317Z"
        fill="white"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    backgroundColor: 'white',
  },
  middleTabWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -56,
    width: 96,
  },
  middleButtonWrapper: {
    borderRadius: 32,
    padding: 5,
    backgroundColor: 'white',
  },
  middleButton: {
    width: 54,
    height: 54,
    backgroundColor: colors.green,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBar;
