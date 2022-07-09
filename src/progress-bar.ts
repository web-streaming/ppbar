import {
  $, addDestroyable, addDestroyableListener, Rect, throttle, Drag, isNumber, isValidNumber, clamp, isString,
  EventEmitterComponent,
  toggleClass,
  isTouch,
  hide,
} from 'wblib';
import { Chapter } from './chapter';
import { EVENT } from './constants';
import { HeatMap } from './heat-map';
import { Marker } from './marker';
import { Thumbnail } from './thumbnail';
import { ProgressEventType, ProgressConfig, RequiredConfig } from './types';

export class ProgressBar extends EventEmitterComponent<ProgressEventType> {
  config: ProgressConfig;

  rect: Rect;

  duration = 0;

  rotate = 0;

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
    this.config = Object.assign({}, config);
    const { duration, live, rotate } = this.config;
    this.rotate = rotate || 0;
    this.updateDuration(duration);
    this.live = live!;

    this.heatEl = this.el.appendChild($('.ppbar_heat'));
    this.chapterEl = this.el.appendChild($('.ppbar_chapter'));
    this.markerEl = this.el.appendChild($('.ppbar_marker'));
    this.dotEl = this.el.appendChild($('.ppbar_dot'));
    this.updateDot();
    this.updateHoverClass();

    this.rect = addDestroyable(this, new Rect(this.el));
    addDestroyable(this, new Drag(this.chapterEl, this.onDragStart, this.onDragging, (ev: MouseEvent) => {
      this.dragging = false;
      if (isTouch) {
        if (this.config.heatMap?.hoverShow) this.heatEl.style.opacity = '0';
        hide(this.thumbnail.el);
      }
      this.emit(EVENT.DRAGEND, this.getCurrentTime(this.getLeft(ev)));
    }));
    addDestroyableListener(this, this.el, 'mousemove', throttle((ev: MouseEvent) => this.onMousemove(ev)), true);
    addDestroyableListener(this, this.el, 'mouseleave', throttle(this.onMouseleave), false);

    this.setChapters();
    this.setMarkers();
    this.setHeatMaps();

    this.thumbnail = addDestroyable(this, new Thumbnail(this.el, this));

    if (this.live) this.updatePlayed(this.duration);

    if ((window as any).ResizeObserver) {
      const ro = new ResizeObserver(throttle(() => this.updateSize()));
      ro.observe(this.el);
      addDestroyable(this, { destroy: () => ro.disconnect() });
    }

    this.updateSize();
  }

  updateSize() {
    this.rect.update();
  }

  updateRotate(r: RequiredConfig['rotate']) {
    this.rotate = r;
    setTimeout(() => this.updateSize());
  }

  updateDuration(duration?: number) {
    this.duration = duration || 0;
    if (!isValidNumber(this.duration)) this.duration = 0;
    if (this.duration) {
      this.updateMarkerPosition(0);
      this.chapters.forEach((c) => c.updateFlex(this.duration));
      this.updateCurrentHeatMap();
    }
  }

  updateConfig(config?: Partial<ProgressConfig>) {
    if (!config) return;
    Object.assign(this.config, config);
    this.live = this.config.live!;
    if (config.duration) this.duration = config.duration;
    if (config.dot) this.updateDot();
    if (config.chapters) this.updateChapters(config.chapters);
    if (config.markers) this.updateMarkers();
    if (config.heatMap) {
      this.heatEl.style.opacity = config.heatMap.hoverShow ? '0' : '1';
      this.updateHeatMap(config.heatMap);
    }
    if (config.thumbnail != null) this.thumbnail.updateOptions(config.thumbnail);
    if (this.live) this.updatePlayed(this.duration);
    if (config.rotate != null) this.rotate = config.rotate;

    this.dotEl.style.transform = 'translateY(-50%)';
    this.updateSize();
  }

  updateMarkerPosition(relativeTime: number) {
    this.markers.forEach((m) => {
      m.time += relativeTime;
      m.update(this.duration);
    });
  }

  updatePlayed(time: number, isDrag?: boolean) {
    if ((this.dragging && !isDrag) || !this.duration) return;
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
      if (c.updateHover(time) && !isTouch && gt1) {
        const h = this.headMaps[i];
        if (h) {
          if (this.prevActiveHeat) this.prevActiveHeat.style.transform = '';
          h.el.style.transform = 'translateY(-2px)';
          this.prevActiveHeat = h.el;
        }
        if (this.prevActiveChapter) this.prevActiveChapter.style.transform = '';
        c.realEl.style.transform = 'scaleY(2.5)';
        this.prevActiveChapter = c.realEl;
        if (this.curChapter === i) {
          this.dotEl.style.transform = 'scale(1.5) translateY(-50%)';
          matched = true;
        }
      }
    });
    if (!isTouch && gt1 && !matched) this.dotEl.style.transform = 'translateY(-50%)';
    if (left == null) left = time / this.duration * this.getWidth();
    return this.thumbnail.update(time, left, this.getWidth());
  }

  private updateDot() {
    const { dot } = this.config;
    this.dotEl.innerHTML = '';
    if (dot && dot !== true) {
      if (isString(dot)) {
        this.dotEl.innerHTML = dot;
      } else {
        this.dotEl.appendChild(dot);
      }
    } else {
      this.dotEl.appendChild($('.ppbar_dot_i'));
    }
  }

  private updateChapters(chapters: RequiredConfig['chapters']) {
    const cLen = this.chapters.length;
    const duration = this.duration;
    if (chapters.length) {
      const maxLen = Math.max(chapters.length, cLen);
      let prev = 0;
      let old;
      let cur;
      for (let i = 0; i < maxLen; i++) {
        old = this.chapters[i];
        cur = chapters[i];
        if (old && cur) {
          old.update(prev, cur.time || duration, duration, cur.title);
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
      c.update(0, duration, duration);
      for (let i = 1; i < cLen; i++) {
        this.chapters[i].destroy();
        this.chapters[i] = undefined as any;
      }
    }

    this.chapters = this.chapters.filter(Boolean);
  }

  private updateMarkers() {
    this.markers.forEach((m) => m.destroy());
    this.markers = [];
    this.setMarkers();
  }

  private updateHoverClass() {
    const { heatMap } = this.config;
    if (heatMap) toggleClass(this.heatEl, 'ppbar_heat-hover', !!heatMap.hoverShow);
  }

  private updateHeatMap(heatMap: RequiredConfig['heatMap']) {
    this.updateHoverClass();
    const points = heatMap.points;
    if (!points || !points.length) {
      this.headMaps.forEach((x) => x.destroy());
      this.headMaps = [];
      return;
    }

    const ret = this.getHeatItems();
    if (ret) {
      const l = Math.max(this.headMaps.length, ret.items.length);
      let old;
      let cur;
      for (let i = 0; i < l; i++) {
        old = this.headMaps[i];
        cur = ret.items[i];
        if (old && cur) {
          old.update(cur, ret.max, ret.flexes[i]);
        } else if (old) {
          old.destroy();
          this.headMaps[i] = undefined as any;
        } else {
          this.headMaps[i] = new HeatMap(this.heatEl, cur, ret.max, ret.flexes[i]);
        }
      }
    } else {
      const l = Math.max(this.chapters.length, this.headMaps.length);
      for (let i = 0; i < l; i++) {
        if (!this.chapters[i]) {
          this.headMaps[i].destroy();
          this.headMaps[i] = undefined as any;
        } else if (!this.headMaps[i]) {
          this.headMaps[i] = new HeatMap(this.heatEl);
        }
      }
    }
  }

  private updateCurrentHeatMap() {
    if (this.headMaps.length < 2) return;
    const ret = this.getHeatItems();
    if (ret) {
      ret.items.forEach((x, i) => {
        this.headMaps[i]?.update(x, ret.max, ret.flexes[i]);
      });
    }
  }

  private setChapters() {
    let duration = this.duration;
    const chapters = this.config.chapters;

    if (chapters && chapters.length) {
      duration = chapters[chapters.length - 1].time || duration;
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
    if (makers && makers.length) {
      makers.forEach((m, i) => {
        this.markers[i] = new Marker(this, this.markerEl, m);
      });
    }
  }

  private setHeatMaps() {
    const heatMap = this.config.heatMap;
    if (!heatMap) return;
    const pointLen = heatMap.points?.length;
    if (!pointLen || pointLen < 2) return;
    const duration = this.duration;

    if (!duration) {
      this.chapters.forEach((_, i) => {
        this.headMaps[i] = new HeatMap(this.heatEl);
      });
      return;
    }

    const ret = this.getHeatItems();
    if (ret) {
      ret.items.forEach((x, i) => {
        this.headMaps[i] = new HeatMap(this.heatEl, x, ret.max, ret.flexes[i]);
      });
    }
  }

  private getHeatItems() {
    const duration = this.duration;
    const heatMap = this.config.heatMap;
    if (!duration || !heatMap) return;
    const points = heatMap.points as {score: number; duration: number}[];
    const pointLen = points.length;
    if (!pointLen || pointLen < 2) return;
    const defaultDuration = heatMap?.defaultDuration as number;
    const chapters = this.chapters;
    const hasChapter = chapters.length > 1;
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
        // eslint-disable-next-line no-console
        console.error(`ppbar heatMap.points[${i}].duration is undefined`);
        return;
      }
      if (points[i].score > max) max = points[i].score;

      curDuration = hasChapter ? chapters[curChapter].duration : duration;

      curLen = point.duration / curDuration * 1000;
      x = totalX + curLen / 2;
      totalX += curLen;

      if (hasChapter) {
        total += point.duration;
        curItem = items[curChapter];
        end = chapters[curChapter].end;
        if (total > end) {
          if (chapters[curChapter + 1]) {
            rDur = total - end;
            curItem.push([1000, point.score]);
            items[++curChapter] = [[0, point.score]];
            totalX = rDur / chapters[curChapter].duration * 1000;
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

    return {
      items,
      flexes: items.map((_, i) => (hasChapter ? chapters[i].el.style.flex : undefined)),
      max,
    };
  }

  private onMousemove(ev: MouseEvent) {
    const l = this.getLeft(ev);
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
    this.updateSize();
    if (isTouch) {
      if (this.config.heatMap?.hoverShow) {
        this.heatEl.style.opacity = '1';
      }
      this.thumbnail.el.style.display = 'block';
    }
    this.onDragging(ev);
  };

  private onDragging = (ev: MouseEvent) => {
    const l = this.getLeft(ev);
    const t = this.getCurrentTime(l);
    this.updatePlayed(t, true);
    this.updateHover(t, l);
    this.emit(EVENT.DRAGGING, t);
  };

  private getCurrentTime(left: number): number {
    return clamp((left / this.getWidth())) * this.duration;
  }

  private getLeft(ev: MouseEvent) {
    if (!this.rotate) return ev.clientX - this.rect.x;
    if (this.rotate === 90) return ev.clientY - this.rect.y;
    return this.rect.bottom - ev.clientY;
  }

  private getWidth() {
    if (this.rotate) return this.rect.height;
    return this.rect.width;
  }
}

export function createBar(container?: HTMLElement | DocumentFragment, config?: ProgressConfig) {
  return new ProgressBar(container, config);
}
