import { Component, svgNS } from 'wblib';

let heatId = 0;

export class HeatMap extends Component {
  private pathEl: SVGPathElement;

  constructor(
    container: HTMLElement,
    dots: number[][],
    max: number,
    flex?: string,
  ) {
    super(container, '.prog_heat_i');

    const d = this.update(dots, max);

    const svg = document.createElementNS(svgNS, 'svg');
    this.pathEl = document.createElementNS(svgNS, 'path');

    const defs = document.createElementNS(svgNS, 'defs');
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    const rect = document.createElementNS(svgNS, 'rect');

    svg.setAttribute('viewBox', '0 0 1000 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('width', '100%');
    clipPath.setAttribute('id', `ppb${heatId}`);
    this.pathEl.setAttributeNS(null, 'd', d);
    rect.setAttribute('clip-path', `url(#ppb${heatId})`);
    rect.setAttribute('fill', 'white');
    rect.setAttribute('fill-opacity', '0.2');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');

    clipPath.appendChild(this.pathEl);
    defs.appendChild(clipPath);
    svg.appendChild(defs);
    svg.appendChild(rect);

    heatId++;

    if (flex) this.el.style.flex = flex;

    this.el.appendChild(svg);
  }

  update(dots: number[][], max: number) {
    const path: string[] = ['M0 100'];
    let prev = [0, 100];
    let cur: number[] = [];
    let next: number[] | undefined;
    let dx1 = 0;
    let dy1 = 0;
    let dx2;
    let dy2;

    const getXY = (d?: number[]) => {
      if (!d) return;
      return [d[0], (1 - d[1] / max) * 100];
    };

    dots.forEach((d, i) => {
      cur = next || getXY(d)!;
      next = getXY(dots[i + 1]) || [1000, 100];

      const m = this.slope(prev, next);
      dx2 = (next[0] - cur[0]) * -0.3;
      dy2 = dx2 * m * 0.6;

      path.push(`C ${(prev[0] - dx1).toFixed(1)} ${(prev[1] - dy1).toFixed(1)}, ${
        (cur[0] + dx2).toFixed(1)} ${(cur[1] + dy2).toFixed(1)}, ${
        cur[0].toFixed(1)} ${cur[1].toFixed(1)}`);

      dx1 = dx2;
      dy1 = dy2;
      prev = cur;
    });

    path.push(`C ${(cur[0] - dx1).toFixed(1)} ${(cur[1] - dy1).toFixed(1)}, 1000 100, 1000 100`);
    return path.join(' ');
  }

  private slope(a: number[], b: number[]) {
    return (b[1] - a[1]) / (b[0] - a[0]);
  }
}
