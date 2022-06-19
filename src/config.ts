export interface ProgressConfig {
  live?: boolean;
  duration?: number;
  dot?: HTMLElement | string;
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

export function getConfig(cfg?: ProgressConfig): ProgressConfig {
  return {
    ...cfg,
  };
}
