import {
  Component, formatTime, clamp, Rect, $, addDestroyable,
} from 'wblib';
import { Chapter } from './chapter';
import { ProgressConfig } from './config';
import { ProgressBar } from './progress-bar';

export class Thumbnail extends Component {
  private opts: Required<Required<ProgressConfig>['thumbnail']> = {
    start: 0,
    gap: 10,
    col: 5,
    row: 5,
    width: 160,
    height: 90,
    images: ['https://nplayer.js.org/assets/images/M1-cce8ec398d0d5cd02d47cb8655f16125.jpg'],
  };

  private imgEl: HTMLElement;

  private timeEl: HTMLElement;

  private titleEl: HTMLElement;

  private rect: Rect;

  private thumbImgPrePic?: number;

  private ssGapRatio?: number;

  private chapters?: Chapter[];

  private markers?: ProgressConfig['markers'];

  constructor(
    container: HTMLElement,
    private prog: ProgressBar,
  ) {
    super(container, '.prog_thumb');

    this.imgEl = this.el.appendChild($('.prog_thumb_img'));
    this.titleEl = this.el.appendChild($('.prog_thumb_title'));
    this.timeEl = this.el.appendChild($('.prog_thumb_time'));
    this.rect = addDestroyable(this, new Rect(this.el));

    this.updateOptions();
  }

  updateOptions() {
    const cfg = this.prog.config;
    const opts = Object.assign(this.opts, cfg?.thumbnail);

    if (opts.images.length) {
      this.imgEl.style.display = 'block';
      this.titleEl.style.width = this.imgEl.style.width = `${opts.width}px`;
      this.imgEl.style.height = `${opts.height}px`;
      this.thumbImgPrePic = opts.col * opts.row;
      this.ssGapRatio = opts.start / opts.gap;
    } else {
      this.imgEl.style.display = 'none';
    }
    const chapters = this.prog.chapters;
    const markers = cfg?.markers;
    if (chapters && chapters.length) this.chapters = chapters;
    if (markers && markers.length) this.markers = markers;
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
    this.timeEl.textContent = formatTime(time);

    let title;
    if (this.markers) {
      for (let i = 0, l = this.markers.length, item; i < l; i++) {
        item = this.markers[i];
        if (time >= item.time && time < (item.time + 2)) {
          title = item.title;
          break;
        }
      }
    }
    if (!title && this.chapters) {
      for (let i = 0, l = this.chapters.length, item; i < l; i++) {
        item = this.chapters[i];
        if (time >= item.start && time <= item.end) {
          title = item.title;
          break;
        }
      }
    }

    if (title) this.titleEl.textContent = title;
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
