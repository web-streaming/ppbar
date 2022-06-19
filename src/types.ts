import { ProgressConfig } from './config';
import { EVENT } from './constants';

export interface ProgressEventType {
  [EVENT.MARKER_CLICK]: (marker: Required<ProgressConfig>['markers'][0]) => void;
  [EVENT.DRAGGING]: (time: number) => void;
  [EVENT.DRAGEND]: (time: number) => void;
  [EVENT.MOUSEMOVE]: (time: number) => void;
  [EVENT.MOUSELEAVE]: () => void;
}
