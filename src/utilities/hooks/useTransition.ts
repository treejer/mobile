import Animated, {
  and,
  block,
  Clock,
  clockRunning,
  cond,
  Easing,
  not,
  onChange,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
  useValue,
} from 'react-native-reanimated';

function useTransition(fill: boolean) {
  const isFilled = useValue<number>(fill ? 1 : 0);

  const clock = new Clock();

  const state = {
    finished: new Animated.Value(0),
    frameTime: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    toValue: new Animated.Value(0),
    easing: Easing.ease,
    duration: 300,
  };

  const finishTiming = [stopClock(clock), set(state.finished, 0), set(state.frameTime, 0), set(state.time, 0)];

  useCode(() => set(isFilled, fill ? 1 : 0), [fill]);

  return block([
    onChange(isFilled, finishTiming),
    cond(and(not(clockRunning(clock)), not(state.finished)), [
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(config.toValue, fill ? 0.5 : 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, finishTiming),
    state.position,
  ]);
}

export default useTransition;
