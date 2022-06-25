import { EVENT } from './constants';

export interface ProgressConfig {
  live?: boolean;
  duration?: number;
  rotate?: 0 | 90 | -90;
  dot?: HTMLElement | string | true;
  chapters?: { time?: number, title: string }[];
  heatMap?: {
    points: (number | { duration?: number; score: number })[];
    defaultDuration?: number;
    hoverShow?: boolean;
  };
  markers?: {
    time: number,
    title?: string,
    image?: string,
    el?: HTMLElement,
    size?: number[],
    [key: string]: any
  }[];
  thumbnail?: {
    start?: number;
    gap?: number;
    row?: number;
    col?: number;
    width?: number;
    height?: number;
    images?: string[];
  }
}

export type RequiredConfig = Required<ProgressConfig>;

export interface ProgressEventType {
  [EVENT.MARKER_CLICK]: (marker: Required<ProgressConfig>['markers'][0]) => void;
  [EVENT.DRAGGING]: (time: number) => void;
  [EVENT.DRAGEND]: (time: number) => void;
  [EVENT.MOUSEMOVE]: (time: number) => void;
  [EVENT.MOUSELEAVE]: () => void;
}
