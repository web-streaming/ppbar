import {
  Component, $, addDestroyable, addDestroyableListener, Rect, throttle, Drag, isNumber, isValidNumber,
} from 'wblib';
import { Chapter } from './chapter';
import { getConfig, ProgressConfig } from './config';
import { HeatMap } from './heat-map';
import { Marker } from './marker';
import { Thumbnail } from './thumbnail';

export class ProgressBar extends Component {
  config: ProgressConfig;

  rect: Rect;

  duration = 0;

  live = false;

  chapters: Chapter[] = [];

  markers: Marker[] = [];

  headMaps: HeatMap[] = [];

  thumbnail: Thumbnail;

  private dotActive = false;

  private dragging = false;

  private chapterEl: HTMLElement;

  private markerEl: HTMLElement;

  private heatEl: HTMLElement;

  private dotEl: HTMLElement;

  constructor(container?: HTMLElement | DocumentFragment, config?: ProgressConfig) {
    super(container, '.ppbar');
    this.config = getConfig(config);
    this.updateDuration(this.config.duration);
    this.updateLive(this.config.live);

    this.heatEl = this.el.appendChild($('.ppbar_heat'));
    this.chapterEl = this.el.appendChild($('.ppbar_chapter'));
    this.markerEl = this.el.appendChild($('.ppbar_marker'));
    this.dotEl = this.el.appendChild($('.ppbar_dot'));
    this.dotEl.appendChild($('.ppbar_dot_i'));

    this.rect = addDestroyable(this, new Rect(this.el));
    addDestroyable(this, new Drag(this.el, this.onDragStart, this.onDragging, this.onDragEnd));
    addDestroyableListener(this, this.el, 'mousemove', throttle((ev: MouseEvent) => this.onMousemove(ev)), true);

    this.setChapters();
    this.setMarkers();
    this.setHeatMaps();

    this.thumbnail = addDestroyable(this, new Thumbnail(this.el, this));
    this.thumbnail.updateOptions();
  }

  updateLive(l?: boolean) {
    this.live = l!;
  }

  updateDuration(duration?: number) {
    this.duration = duration || 0;
    if (!isValidNumber(this.duration)) this.duration = 0;
    this.live = this.config.live!;
  }

  updatePlayed() {

  }

  updateBuffer() {

  }

  updateHover() {

  }

  updateChapters() {

  }

  updateMarkers() {

  }

  updateHeatMap() {

  }

  updateThumbnail() {

  }

  private setChapters() {
    let duration = this.duration;
    const chapters = this.config.chapters;

    if (chapters && chapters.length) {
      duration = chapters[chapters.length - 1].time || duration;
      if (!duration) return;
      const frag = document.createDocumentFragment();

      let prev = 0;
      chapters.forEach((c, i) => {
        const len = (c.time || duration) - prev;
        this.chapters[i] = new Chapter(frag, prev, c.time || duration, c.title);
        this.chapters[i].el.style.flex = String(Math.max(0, len / duration));
        prev = c.time || 0;
      });

      this.chapterEl.appendChild(frag);
    } else {
      this.chapters[0] = new Chapter(this.chapterEl, 0, duration);
    }
  }

  private setMarkers() {
    const makers = this.config.markers;
    if (makers && makers.length && this.duration) {
      makers.forEach((m, i) => {
        this.markers[i] = new Marker(this.markerEl, m, this.duration);
      });
    }
  }

  private setHeatMaps() {
    const duration = this.duration;
    const heatMap = this.config.heatMap;
    if (!duration || !heatMap) return;
    const points = heatMap.points as {score: number; duration: number}[];
    const pointLen = points.length;
    if (!pointLen || pointLen < 2) return;
    const defaultDuration = heatMap?.defaultDuration as number;
    const hasChapter = this.chapters.length > 1;
    const items: number[][][] = [[]];

    let curChapter = 0;
    let curItem;
    let point;
    let rDur;
    let max = 0;
    let total = 0;
    let curDuration = 0;
    let curLen = 0;
    let totalX = 0;
    let x = 0;
    let end;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      if (isNumber(point)) {
        point = points[i] = { score: point, duration: defaultDuration };
      } else {
        point.duration = point.duration || defaultDuration;
      }
      if ((points[i] as any).duration == null) {
        // console.error();
        return;
      }
      if (points[i].score > max) max = points[i].score;

      curDuration = hasChapter ? this.chapters[curChapter].duration : duration;

      curLen = point.duration / curDuration * 1000;
      x = totalX + curLen / 2;
      totalX += curLen;

      if (hasChapter) {
        total += point.duration;
        curItem = items[curChapter];
        end = this.chapters[curChapter].end;
        if (total > end) {
          if (this.chapters[curChapter + 1]) {
            rDur = total - end;
            curItem.push([1000, point.score]);
            items[++curChapter] = [[0, point.score]];
            totalX = rDur / this.chapters[curChapter].duration * 1000;
          } else {
            curItem.push([1000, point.score]);
          }
        } else {
          curItem.push([x, point.score]);
        }
      } else {
        items[0].push([x, point.score]);
      }
    }
    items.forEach((item, i) => {
      this.headMaps[i] = new HeatMap(this.heatEl, item, max, hasChapter ? this.chapters[i].el.style.flex : undefined);
    });
  }

  private onMousemove(ev: MouseEvent) {}

  private onDragStart = (ev: MouseEvent) => {};

  private onDragging = (ev: MouseEvent) => {};

  private onDragEnd = (ev: MouseEvent) => {};
}
