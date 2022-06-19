import {
  $, addDestroyable, addDestroyableListener, Rect, throttle, Drag, isNumber, isValidNumber, clamp, addClass, isString,
  EventEmitterComponent,
} from 'wblib';
import { Chapter } from './chapter';
import { getConfig, ProgressConfig } from './config';
import { EVENT } from './constants';
import { HeatMap } from './heat-map';
import { Marker } from './marker';
import { Thumbnail } from './thumbnail';
import { ProgressEventType } from './types';

export class ProgressBar extends EventEmitterComponent<ProgressEventType> {
  config: ProgressConfig;

  rect: Rect;

  duration = 0;

  live = false;

  chapters: Chapter[] = [];

  markers: Marker[] = [];

  headMaps: HeatMap[] = [];

  thumbnail: Thumbnail;

  private curChapter = 0;

  private prevActiveHeat?: HTMLElement;

  private prevActiveChapter?: HTMLElement;

  private dragging = false;

  private chapterEl: HTMLElement;

  private markerEl: HTMLElement;

  private heatEl: HTMLElement;

  private dotEl: HTMLElement;

  constructor(container?: HTMLElement | DocumentFragment, config?: ProgressConfig) {
    super(container, '.ppbar');
    this.config = getConfig(config);
    const {
      duration, live, dot, heatMap,
    } = this.config;
    this.updateDuration(duration);
    this.updateLive(live);

    this.heatEl = this.el.appendChild($('.ppbar_heat'));
    this.chapterEl = this.el.appendChild($('.ppbar_chapter'));
    this.markerEl = this.el.appendChild($('.ppbar_marker'));
    this.dotEl = this.el.appendChild($('.ppbar_dot'));
    if (dot) {
      if (isString(dot)) {
        this.dotEl.innerHTML = dot;
      } else {
        this.dotEl.appendChild(dot);
      }
    } else {
      this.dotEl.appendChild($('.ppbar_dot_i'));
    }
    if (heatMap?.hoverShow) addClass(this.heatEl, 'ppbar_heat-hover');

    this.rect = addDestroyable(this, new Rect(this.el));
    addDestroyable(this, new Drag(this.chapterEl, this.onDragStart, this.onDragging, (ev: MouseEvent) => {
      this.dragging = false;
      this.emit(EVENT.DRAGEND, this.getCurrentTime(ev.clientX - this.rect.x));
    }));
    addDestroyableListener(this, this.el, 'mousemove', throttle((ev: MouseEvent) => this.onMousemove(ev)), true);
    addDestroyableListener(this, this.el, 'mouseleave', throttle(this.onMouseleave), false);

    this.setChapters();
    this.setMarkers();
    this.setHeatMaps();

    this.thumbnail = addDestroyable(this, new Thumbnail(this.el, this));
    this.thumbnail.updateOptions();

    if (this.live) {
      this.updatePlayed(this.duration);
    }
  }

  updateSize() {
    this.rect.update();
  }

  updateLive(l?: boolean) {
    this.live = l!;
  }

  updateDuration(duration?: number) {
    this.duration = duration || 0;
    if (!isValidNumber(this.duration)) this.duration = 0;
  }

  updatePlayed(time: number, isDrag?: boolean) {
    if (this.dragging && !isDrag) return;
    this.chapters.forEach((c, i) => {
      if (c.updatePlayed(time)) this.curChapter = i;
    });

    this.dotEl.style.left = `${time / this.duration * 100}%`;
  }

  updateBuffer(time: number) {
    this.chapters.forEach((c) => c.updateBuffer(time));
  }

  updateHover(time: number, left?: number) {
    let matched = false;
    const gt1 = this.chapters.length > 1;
    this.chapters.forEach((c, i) => {
      if (c.updateHover(time) && gt1) {
        const h = this.headMaps[i];
        if (h) {
          if (this.prevActiveHeat) this.prevActiveHeat.style.transform = '';
          h.el.style.transform = 'translateY(-1.5px)';
          this.prevActiveHeat = h.el;
        }
        if (this.prevActiveChapter) this.prevActiveChapter.style.transform = '';
        c.realEl.style.transform = 'scaleY(2.8)';
        this.prevActiveChapter = c.realEl;
        if (this.curChapter === i) {
          this.dotEl.style.transform = 'scale(1.2) translateY(-50%)';
          matched = true;
        }
      }
    });
    if (gt1 && !matched) this.dotEl.style.transform = 'translateY(-50%)';
    if (left == null) left = time / this.duration * this.rect.width;
    this.thumbnail.update(time, left, this.rect.width);
  }

  updateChapters(chapters?: ProgressConfig['chapters']) {
    const cLen = this.chapters.length;
    if (!chapters && cLen < 2) return;
    const duration = this.duration;
    if (chapters && chapters.length) {
      const maxLen = Math.max(chapters.length, cLen);
      let prev = 0;
      let old;
      let cur;
      for (let i = 0; i < maxLen; i++) {
        old = this.chapters[i];
        cur = chapters[i];
        if (old && cur) {
          old.start = prev;
          old.end = cur.time || duration;
          old.updateFlex(duration);
        } else if (old) {
          old.destroy();
          this.chapters[i] = undefined as any;
        } else {
          this.chapters[i] = new Chapter(this.chapterEl, duration, prev, cur.time || duration, cur.title);
        }
        if (cur) prev = cur.time || duration;
      }
    } else {
      const c = this.chapters[0];
      c.start = 0;
      c.end = duration;
      c.updateFlex(duration);
      for (let i = 1; i < cLen; i++) {
        this.chapters[i].destroy();
        this.chapters[i] = undefined as any;
      }
    }

    this.chapters = this.chapters.filter(Boolean);
  }

  updateMarkers(markers: ProgressConfig['markers']) {

  }

  updateHeatMap(heatMap: ProgressConfig['heatMap']) {

  }

  updateThumbnail(thumb: ProgressConfig['thumbnail']) {

  }

  updateMarkerPosition(relativeTime: number) {

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
        this.chapters[i] = new Chapter(frag, duration, prev, c.time || duration, c.title);
        prev = c.time || 0;
      });

      this.chapterEl.appendChild(frag);
    } else {
      this.chapters[0] = new Chapter(this.chapterEl, duration, 0, duration);
    }
  }

  private setMarkers() {
    const makers = this.config.markers;
    if (makers && makers.length && this.duration) {
      makers.forEach((m, i) => {
        this.markers[i] = new Marker(this, this.markerEl, m);
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

  private onMousemove(ev: MouseEvent) {
    const l = ev.clientX - this.rect.x;
    const t = this.getCurrentTime(l);
    this.updateHover(t, l);
    this.emit(EVENT.MOUSEMOVE, t);
  }

  private onMouseleave = () => {
    this.emit(EVENT.MOUSELEAVE);
    setTimeout(() => {
      if (this.prevActiveChapter) {
        this.prevActiveChapter.style.transform = '';
        this.prevActiveChapter = undefined;
      }
      if (this.prevActiveHeat) {
        this.prevActiveHeat.style.transform = '';
        this.prevActiveHeat = undefined;
      }
    });
  };

  private onDragStart = (ev: MouseEvent) => {
    this.dragging = true;
    this.rect.update();
    this.onDragging(ev);
  };

  private onDragging = (ev: MouseEvent) => {
    const l = ev.clientX - this.rect.x;
    const t = this.getCurrentTime(l);
    this.updatePlayed(t, true);
    this.updateHover(t, l);
    this.emit(EVENT.DRAGGING, t);
  };

  private getCurrentTime(left: number): number {
    return clamp((left / this.rect.width)) * this.duration;
  }
}
