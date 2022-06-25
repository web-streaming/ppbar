import { Component, $ } from 'wblib';

export class Chapter extends Component {
  private bufferedEl: HTMLElement;

  private playedEl: HTMLElement;

  private hoverEl: HTMLElement;

  realEl: HTMLElement;

  duration = 0;

  constructor(
    container: HTMLElement | DocumentFragment,
    duration: number,
    public start: number,
    public end: number,
    public title?: string,
  ) {
    super(container, '.ppbar_chapter_i');
    const wrapEl = this.realEl = this.el.appendChild($('.ppbar_chapter_i_w'));
    this.bufferedEl = wrapEl.appendChild($('.ppbar_chapter_i_b'));
    this.hoverEl = wrapEl.appendChild($('.ppbar_chapter_i_h'));
    this.playedEl = wrapEl.appendChild($('.ppbar_chapter_i_p'));
    this.update(start, end, duration, title);
  }

  update(start: number, end: number, duration: number, title?: string) {
    this.start = start;
    this.end = end;
    this.duration = end - start;
    this.title = title || '';
    this.updateFlex(duration);
  }

  updateFlex(duration: number) {
    this.el.style.flex = String(Math.max(0, this.duration / duration));
  }

  match(time: number) {
    return time >= this.start && time <= this.end;
  }

  updateHover(time: number) {
    return this.setBar(time, this.hoverEl);
  }

  updateBuffer(time: number) {
    return this.setBar(time, this.bufferedEl);
  }

  updatePlayed(time: number) {
    return this.setBar(time, this.playedEl);
  }

  private setBar(time: number, dom: HTMLElement) {
    const match = this.match(time);
    dom.style.transform = `scaleX(${
      match ? ((time - this.start) / this.duration) : time > this.end ? 1 : 0
    })`;
    return match;
  }
}
