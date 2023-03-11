import {useEffect, useMemo, useState} from 'react';
import {breakpoints, compareScreenBreakpoint} from '../helpers/screen';
import {Dimensions} from 'react-native';

export const isBrowser = typeof window !== 'undefined';

const {width, height} = Dimensions.get('window');

export type ScreenSize = {
  width: number;
  height: number;
};

export type UseWindowSize = {
  screenSize: ScreenSize;
  xs: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  isMobileScreen: boolean;
  isXLargeScreen: boolean;
  isLargeScreen: boolean;
  isSmallScreen: boolean;
};

export function useWindowSize(initialWidth = width, initialHeight = height): UseWindowSize {
  const [state, setState] = useState<ScreenSize>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  });

  const xs = useMemo(() => compareScreenBreakpoint(state.width, breakpoints.xs), [state.width]);
  const md = useMemo(() => compareScreenBreakpoint(state.width, breakpoints.md), [state.width]);
  const lg = useMemo(() => compareScreenBreakpoint(state.width, breakpoints.lg), [state.width]);
  const xl = useMemo(() => compareScreenBreakpoint(state.width, breakpoints.xl), [state.width]);
  const xxl = useMemo(() => compareScreenBreakpoint(state.width, breakpoints.xxl), [state.width]);

  const isMobileScreen = useMemo(() => state.width < breakpoints.sm[1], [state.width]);
  const isXLargeScreen = useMemo(() => state.width > breakpoints.xxl[0], [state.width]);
  const isLargeScreen = useMemo(() => state.width > breakpoints.xl[0], [state.width]);
  const isSmallScreen = useMemo(() => state.width <= breakpoints.sm[0], [state.width]);

  useEffect(() => {
    if (isBrowser) {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handler);

      return () => {
        window.removeEventListener('resize', handler);
      };
    }
  }, []);

  return {
    screenSize: state,
    xs,
    md,
    lg,
    xl,
    xxl,

    isMobileScreen,
    isXLargeScreen,
    isLargeScreen,
    isSmallScreen,
  };
}
