import { useLayoutEffect, useMemo, useState } from 'react';

/**
 * Represents the measured dimensions and position of an element.
 * This type includes all the relevant properties from DOMRectReadOnly.
 */
export type UseMeasureRect = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>;

/**
 * A ref callback function that sets the element to be measured.
 * @template E - The type of element to measure (defaults to Element)
 */
export type UseMeasureRef<E extends Element = Element> = (element: E) => void;

/**
 * The return type of the useMeasure hook.
 * @template E - The type of element to measure (defaults to Element)
 */
export type UseMeasureResult<E extends Element = Element> = [UseMeasureRef<E>, UseMeasureRect];

/**
 * Default state for measurements when no element is being measured.
 */
const defaultState: UseMeasureRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

/**
 * A React hook that measures the dimensions and position of an element.
 * This hook uses ResizeObserver to track changes in the element's size and position.
 * 
 * @template E - The type of element to measure (defaults to Element)
 * @returns {UseMeasureResult<E>} A tuple containing:
 *   - A ref callback function to attach to the element to measure
 *   - An object containing the element's measurements
 * 
 * @example
 * const [ref, measurements] = useMeasure<HTMLDivElement>();
 * return <div ref={ref}>Height: {measurements.height}</div>;
 */
export const useMeasure = <E extends Element = Element>(): UseMeasureResult<E> => {
  // State to store the element being measured
  const [element, ref] = useState<E | null>(null);
  // State to store the measurements
  const [rect, setRect] = useState<UseMeasureRect>(defaultState);

  // Create a ResizeObserver to track changes in the element's size and position
  const observer = useMemo(
    () =>
      {
        if (typeof window === 'undefined') return null;
        
        return new (window as any).ResizeObserver((entries: ResizeObserverEntry[]) => {
          if (entries[0]) {
            const { x, y, width, height, top, left, bottom, right } = entries[0].contentRect;
            setRect({ x, y, width, height, top, left, bottom, right });
          }
        });
      },
    []
  );

  // Set up and clean up the ResizeObserver when the element changes
  useLayoutEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, rect];
}
