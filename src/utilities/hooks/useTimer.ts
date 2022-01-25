import {useEffect, useState} from 'react';

export function useTimer(duration: number, onEnd: () => void): [number, (duration: number) => void] {
  const [time, setTime] = useState<number>(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    if (time === 0) {
      clearInterval(timer);
      onEnd?.();
    }

    return () => {
      clearInterval(timer);
    };
  }, [time, setTime, duration, onEnd]);

  return [time, setTime];
}
