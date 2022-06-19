import { Component, $, addDestroyableListener } from 'wblib';
import { ProgressConfig } from './config';
import { EVENT } from './constants';
import { ProgressBar } from './progress-bar';

export class Marker extends Component {
  time: number;

  private tipEl: HTMLElement;

  constructor(prog: ProgressBar, container: HTMLElement, private cfg: Required<ProgressConfig>['markers'][0]) {
    super(container, '.ppbar_marker_i');

    this.tipEl = this.el.appendChild($('.ppbar_marker_i_tip'));
    if (cfg.title) {
      this.tipEl.textContent = cfg.title;
    }

    this.el.appendChild($('.ppbar_marker_i_d'));

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

    addDestroyableListener(this, this.el, 'click', () => {
      prog.emit(EVENT.MARKER_CLICK, this.cfg);
    });

    this.time = cfg.time;
    this.update(prog.duration);
  }

  update(duration: number) {
    if (duration) {
      if (this.time < 0) {
        this.el.style.right = `${-this.time / duration * 100}%`;
      } else {
        this.el.style.left = `${this.time / duration * 100}%`;
      }
    }
  }
}
