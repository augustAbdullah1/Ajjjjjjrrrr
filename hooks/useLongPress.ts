import { useCallback, useRef } from 'react';

const useLongPress = <T,>(
  onLongPress: (item: T) => void,
  ms: number = 300
) => {
  // Fix: Initialize useRef with null to provide an explicit initial value, which can prevent confusing TypeScript errors.
  const timeout = useRef<number | null>(null);
  // Fix: Initialize useRef with null to provide an explicit initial value.
  const targetItem = useRef<T | null>(null);

  const start = useCallback((item: T) => {
    targetItem.current = item;
    timeout.current = window.setTimeout(() => {
      if (targetItem.current) {
        onLongPress(targetItem.current);
      }
    }, ms);
  }, [onLongPress, ms]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  const onTouchStart = (item: T) => () => start(item);
  const onTouchEnd = () => clear;

  const onMouseDown = (item: T) => () => start(item);
  const onMouseUp = () => clear;
  const onMouseLeave = () => clear;

  return (item: T) => ({
    onTouchStart: onTouchStart(item),
    onTouchEnd: onTouchEnd(),
    onMouseDown: onMouseDown(item),
    onMouseUp: onMouseUp(),
    onMouseLeave: onMouseLeave(),
  });
};

export default useLongPress;