import {
  Component, formatTime, clamp, Rect, $, addDestroyable,
} from 'wblib';
import { ProgressBar } from './progress-bar';
import { ProgressConfig, RequiredConfig } from './types';

export class Thumbnail extends Component {
  private opts: Required<RequiredConfig['thumbnail']> = {
    start: 0,
    gap: 10,
    col: 5,
    row: 5,
    width: 160,
    height: 90,
    images: [],
  };

  private imgEl: HTMLElement;

  private timeEl: HTMLElement;

  private titleEl: HTMLElement;

  private rect: Rect;

  private thumbImgPrePic?: number;

  private ssGapRatio?: number;

  constructor(
    container: HTMLElement,
    private prog: ProgressBar,
  ) {
    super(container, '.ppbar_thumb');

    this.imgEl = this.el.appendChild($('.ppbar_thumb_img'));
    this.titleEl = this.el.appendChild($('.ppbar_thumb_title'));
    this.timeEl = this.el.appendChild($('.ppbar_thumb_time'));
    this.rect = addDestroyable(this, new Rect(this.el));

    this.updateOptions(this.prog.config.thumbnail);
  }

  updateOptions(cfg: ProgressConfig['thumbnail']) {
    const opts = Object.assign(this.opts, cfg);

    if (opts.images.length) {
      this.imgEl.style.display = 'block';
      this.titleEl.style.width = this.imgEl.style.width = `${opts.width}px`;
      this.imgEl.style.height = `${opts.height}px`;
      this.thumbImgPrePic = opts.col * opts.row;
      this.ssGapRatio = opts.start / opts.gap;
    } else {
      this.imgEl.style.display = 'none';
    }
    this.rect.update();
  }

  update(time: number, x: number, maxX: number) {
    if (this.opts.images.length) {
      const thumb = this.getCurrentThumb(time);
      if (thumb) {
        this.imgEl.style.backgroundImage = `url(${thumb.url})`;
        this.imgEl.style.backgroundPosition = `-${thumb.x}px -${thumb.y}px`;
      }
    } else {
      this.rect.update();
    }

    const live = this.prog.live;
    this.timeEl.textContent = `${live ? '-' : ''}${formatTime(live ? this.prog.duration - time : time)}`;

    const { markers, chapters } = this.prog;
    let title;
    if (markers.length) {
      for (let i = 0, l = markers.length, item; i < l; i++) {
        item = markers[i];
        if (time >= item.time && time < (item.time + 2)) {
          title = item.title;
          break;
        }
      }
    }
    if (!title && chapters.length) {
      for (let i = 0, l = chapters.length, item; i < l; i++) {
        item = chapters[i];
        if (time >= item.start && time <= item.end) {
          title = item.title;
          break;
        }
      }
    }

    this.titleEl.textContent = title || '';
    const half = this.rect.width / 2;
    this.el.style.left = `${clamp(x - half, 0, Math.max(0, maxX - 2 * half))}px`;
  }

  private getCurrentThumb(time: number) {
    const i = Math.max(time / this.opts.gap - this.ssGapRatio!, 0) | 0;
    const url = this.opts.images[(i / this.thumbImgPrePic!) | 0];
    if (!url) return;
    const x = (i % this.opts.col) * this.opts.width;
    const y = ~~((i % this.thumbImgPrePic!) / this.opts.row) * this.opts.height;
    return { url, x, y };
  }
}
