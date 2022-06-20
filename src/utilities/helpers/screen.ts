import {Dimensions} from 'react-native';

export enum Measurements {
  screenHeight = Dimensions.get('window').height,
  screenWidth = Dimensions.get('window').width,
}

export function isSmallScreen() {
  return Measurements.screenWidth < 400;
}

export function isMobileScreen() {
  return Measurements.screenWidth < 768;
}

export enum Breakpoint {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

export type Breakpoints = {
  [key in Breakpoint]: number[];
};

export const breakpoints: Breakpoints = {
  [Breakpoint.xs]: [0, 576],
  [Breakpoint.sm]: [576, 768],
  [Breakpoint.md]: [768, 992],
  [Breakpoint.lg]: [992, 1200],
  [Breakpoint.xl]: [1200, 1400],
  [Breakpoint.xxl]: [1400, Infinity],
};

export function compareScreenBreakpoint(screenWidth: number, breakpoint: number[]) {
  const [min, max] = breakpoint;
  return screenWidth >= min && screenWidth < max;
}
