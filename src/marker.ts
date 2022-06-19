import { Component, $ } from 'wblib';
import { ProgressConfig } from './config';

export class Marker extends Component {
  time: number;

  constructor(container: HTMLElement, cfg: Required<ProgressConfig>['markers'][0], duration: number) {
    super(container, '.prog_marker_i');

    if (cfg.title) {
      // new Tooltip(this.el, cfg.title);
    }

    this.el.appendChild($('.prog_marker_i_d'));

    if (cfg.image) {
      const img = new Image(cfg.size?.[0], cfg.size?.[1]);
      img.src = cfg.image;
      this.el.appendChild(img);
    } else if (cfg.el) {
      if (cfg.size && cfg.size.length > 1) {
        cfg.el.style.width = `${cfg.size[0]}px`;
        cfg.el.style.height = `${cfg.size[1]}px`;
      }
      this.el.appendChild(cfg.el);
    }

    this.time = cfg.time;
    this.update(duration);
  }

  update(duration: number) {
    if (duration) {
      this.el.style.left = `${this.time / duration * 100}%`;
    }
  }
}
