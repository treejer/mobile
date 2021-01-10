import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

import {BottomTabBarProps, BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacityProps, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';
import Animated, {useValue, Easing, timing, interpolate} from 'react-native-reanimated';

import {GreenBlock, Tree, User} from '../Icons';

interface Props extends BottomTabBarProps {}

function TabBar({state, descriptors, navigation}: Props) {
  const {tabBarVisible} = descriptors[state.routes[state.index].key].options;
  const mounted = useRef(false);
  const timeout = useRef<Animated.BackwardCompatibleWrapper | undefined>();

  const visibilityAnimatedValue = useValue(tabBarVisible ? 1 : 0);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    timeout.current = timing(visibilityAnimatedValue, {
      duration: 500,
      toValue: tabBarVisible ? 1 : 0,
      easing: Easing.inOut(Easing.ease),
    });

    timeout.current.start();

    return () => {
      timeout.current?.stop();
    };
  }, [visibilityAnimatedValue, tabBarVisible]);

  const translateY = interpolate(visibilityAnimatedValue, {
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const maxHeight = interpolate(visibilityAnimatedValue, {
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        globalStyles.horizontalStack,
        globalStyles.justifyContentEvenly,
        globalStyles.alignItemsCenter,
        {
          transform: [{translateY}],
          opacity: visibilityAnimatedValue,
          maxHeight,
        },
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
            navigation.navigate(route.name);
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
          onLongPress,
          onPress,
          options,
          index,
        });
      })}
    </Animated.View>
  );
}

function renderTabItem({
  isFocused,
  onLongPress,
  onPress,
  options,
  index,
}: {
  isFocused: boolean;
  onLongPress: TouchableOpacityProps['onLongPress'];
  onPress: TouchableOpacityProps['onPress'];
  options: BottomTabNavigationOptions;
  index: number;
}) {
  switch (index) {
    case 0:
    case 2:
      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={{padding: 30}}
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
});

export default TabBar;
