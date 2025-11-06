import { useCallback, useRef } from 'react';

const useLongPress = <T,>(
  onLongPress: (item: T) => void,
  ms: number = 300
) => {
  const timeout = useRef<number>();
  const targetItem = useRef<T>();

  const start = useCallback((item: T) => {
    targetItem.current = item;
    timeout.current = setTimeout(() => {
      if (targetItem.current) {
        onLongPress(targetItem.current);
      }
    }, ms);
  }, [onLongPress, ms]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
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
