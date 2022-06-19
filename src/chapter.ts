import { Component, $ } from 'wblib';

export class Chapter extends Component {
  private bufferedEl: HTMLElement;

  private playedEl: HTMLElement;

  private hoverEl: HTMLElement;

  constructor(
    container: HTMLElement | DocumentFragment,
    public start: number,
    public end: number,
    public title?: string,
  ) {
    super(container, '.ppbar_chapter_i');
    const wrapEl = this.el.appendChild($('.ppbar_chapter_i_w'));
    this.bufferedEl = wrapEl.appendChild($('.ppbar_chapter_i_b'));
    this.hoverEl = wrapEl.appendChild($('.ppbar_chapter_i_h'));
    this.playedEl = wrapEl.appendChild($('.ppbar_chapter_i_p'));
  }

  get duration() {
    return this.end - this.start;
  }

  private setBar(time: number, dom: HTMLElement) {
    const match = this.match(time);
    dom.style.transform = `scaleX(${
      match ? ((time - this.start) / this.duration) : time > this.end ? 1 : 0
    })`;
    return match;
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
}
