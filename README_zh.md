# PPBar

[![npm version](https://img.shields.io/npm/v/ppbar?logo=npm)](https://github.com/web-streaming/ppbar) 
[![npm version](https://img.badgesize.io/https:/unpkg.com/ppbar/dist/index.min.js?compression=gzip)](https://github.com/web-streaming/ppbar) 

功能强大的播放器进度条，支持章节、标记、热力图、缩略图、直播、旋转等功能。还支持自定义 UI，可以将它打造成 Youtube 或 B站的播放器进度条的外观。

如果你觉得 PPBar 还不错，欢迎给它点一个 Star⭐️，来鼓励作者。

[![ppbar](./demo/p.png)](https://web-streaming.github.io/ppbar/)

[English](./README.md)

## 安装

```
npm i ppbar
```

或者通过 CDN 使用

```html
<link rel="stylesheet" href="https://unpkg.com/ppbar@latest/dist/index.min.css">

<script src="https://unpkg.com/ppbar@latest/dist/index.min.js"></script>

<script>
  console.log(ppbar)
</script>
```

## 使用

使用 ppbar，需要导入 `ProgressBar` 类和 ppbar 的样式。

```js
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

const div = document.createElement('div');
const bar = new ProgressBar(div, {
  // 参数
})

document.body.appendChild(div)
```

`ProgressBar` 构造函数接收两个参数，第一个它的容器，第二个是 ppbar 的参数。如果设置第一个参数会自动将 ppbar 的 DOM 元素添加到传入容器中。

当然希望手动添加 ppbar 的 DOM 元素，可以不传入第一个参数。

```ts
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

const bar = new ProgressBar(undefined, {
  // 参数
})

document.body.appendChild(bar.el)
```

ppbar 有一个 `updateConfig` 方法，可以随时通过它来动态更新参数。

```ts
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

const bar = new ProgressBar(undefined, {
  // 参数
})

document.body.appendChild(bar.el)

bar.updateConfig({ /* 新参数 */ })

// 如果不需要 bar 对象了请销毁它
bar.destroy()
```

### 章节

章节可以设置进度条分段效果，每个章节必须有一个标题，鼠标 hover 进度条时会被展示出来。

章节应该有个 `time` 属性，表示该章节的结尾，最后一个章节可以省略 `time` 属性。

```js
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

new ProgressBar(document.body, {
  chapters: [
    { time: 10, title: 'chapter1' },
    { time: 20, title: 'chapter2' },
    { title: 'chapter3' },
  ]
})
```

上面一共设置 3 个章节，分别是：

1. `0s - 10s` chapter1
2. `10s - 20s` chapter2
3. `20s - duration` chapter3

### 标记

该功能允许你在进度条上设置标记点，每个标记点可以放入自定义的 DOM 或一张图片。

```ts
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

new ProgressBar(document.body, {
  markers: [
    { time: 10, title: 'marker1', image: './img.jpg', size: [30, 30] },
  ]
})
```

上面代码在进度条 10 秒位置，设置了一个标记点，标记点中有一个图片，它的大小是 `30x30`。

除了图片还可以使用自定义的 dom 元素。

```ts
import ProgressBar from 'ppbar';
import 'ppbar/dist/index.min.css';

const div = document.createElement('div')

new ProgressBar(document.body, {
  markers: [
    { time: 10, title: 'marker1', el: div },
  ]
})
```

当标记点被点击时会触发 `markerClick` 事件。

```ts
import { EVENT, ProgressBar } from 'ppbar'

const bar = new ProgressBar(document.body, {
  markers: [
    { time: 10, title: 'marker1' },
  ]
})

bar.on(EVENT.MARKER_CLICK, (marker) => console.log(marker))
```

### 热力图

热力图用于标记整个视频不同时间段观看量的变化。比如 0 到 5 秒观看量是 100，5 到 10 秒观看量是 200 ... 然后将这些观看量绘制成曲线就是 ppbar 的热力图了。

```ts
const bar = new ProgressBar(document.body, {
  heatMap: {
    points: [1, 2, 3],
    defaultDuration： 5,
  }
})
```

上面代码配置表示，每个点表示的时长为 `5` 秒，也就是 `0 - 5` 的值是 `1`，`5 - 10` 为 `2`，`10 - 15` 为 `3`。

另外还支持给每个点单独设置时长。

```ts
const bar = new ProgressBar(document.body, {
  heatMap: {
    points: [{ duration: 10, score: 1 }, { score: 2 }, { duration: 2, score: 3 }],
    defaultDuration： 5,
  }
})
```

上面配置中，第一个和第三个有自己的时长，第二个则是使用 `defaultDuration`。 

如果希望热力图和 Youtube 一样，只有 hover 的时候才显示，可以设置 `hoverShow`。

```ts
const bar = new ProgressBar(document.body, {
  heatMap: {
    points: [1, 2, 3],
    defaultDuration： 5,
    hoverShow: true
  }
})
```

### 缩略图

缩略图用于预览视频的不同时间点的画面。一张缩略图由多张小缩略图拼接而成。

```ts
const bar = new ProgressBar(document.body, {
  thumbnail: {
    start: 0, // 缩略图开始时间，单位秒
    gap: 10, // 单个小缩略图表示的时长
    row: 5, // 大缩略图是又几行小缩略图组成
    col: 5, // 大缩略图是又几列小缩略图组成
    width: 160, // 单个小缩略图宽度
    height: 90, // 单个小缩略图的高度
    images: [], // 缩略图地址数组
  }
})
```

以上参数的值都是默认参数。

另外如果你不希望展示缩略图可以将它设置为 `false`。

```ts
const bar = new ProgressBar(document.body, {
  thumbnail: false
})
```

### 直播

ppbar 还支持直播时移，在直播模式下进度条的时间展示将会是负数。

```ts
new ProgressBar(document.body, { live: true })
```

另外还可以使用 `updateConfig` 方法动态开启关闭直播模式。

```ts
const bar = new Progress(document.body) 

bar.updateConfig({ live: true })
```

### 旋转

ppbar 还支持被旋转，例如在移动端不使用全屏，但是希望视频横着播放，这是就会对播放器设置 `transform: rotate(90deg)`。这时候就需要手动更新 ppbar 的旋转来防止 ppbar 交互失效。

```ts
const div = document.createElement('div')
div.style.transform = 'rotate(90deg)'
new ProgressBar(div, { rotate: 90 })
```

你还可以通过 `updateRotate` 方法来动态更新参数。

```ts
const bar = new ProgressBar(document.body)

bar.updateRotate(90)
```

### 事件

ppbar 还会抛出事件，你可以使用 `on` 方法监听事件，`once` 方法监听一次事件，`off` 取消监听事件。

```ts
import { EVENT, ProgressBar } from 'ppbar'

const bar = new ProgressBar(document.body)

bar.once(EVENT.DRAGGING, console.log)
bar.on(EVENT.DRAGEND, console.log)
bar.off(EVENT.DRAGEND, console.log)
```

具体的事件描述请查看 [API 事件章节](#api)

## 自定义样式

ppbar 支持自定义修改样式。

```scss
new ProgressBar(document.body, {
  dot: '<svg>...</svg>'
})
```

参数 `dot` 可以自定进度条原点，可以是自定义 DOM 元素、字符串，为字符串时将直接设置 `innerHTML`。

另外还可以通过 CSS 变量来设置 ppbar 的主题色。

```ts
const bar = new ProgressBar(document.body) 

bar.el.style.setProperty('--primary-color', 'rgba(35,173,229, 1)');
```

`--primary-color` 是 ppbar 的主题色，默认为 `#f00`。

最后你还可以通过 Sass 变量来自定义样式。

```scss
@use '~ppbar/lib/index.scss' with (
  $primaryColor: #0f0,
  $markerDotBg: #f00,
  $heatMapHeight: 30px
)
```

在 scss 文件中导入并覆盖样式。

```ts
import ProgressBar from 'ppbar'
import './index.scss'
```

导入上面自定义的样式。

目前一共支持 3 种自定义 sass 变量。

- `$primaryColor` 进度条的主题色，默认 `#f00`
- `$markerDotBg` 标记点的背景色，默认 `#fff`
- `$heatMapHeight` 热力图高度，默认 `40px`


## 集成到播放器

你可以使用 ppbar 打造自己的播放器，或者将它集成到现成的播放器中，下面以 [nplayer](https://github.com/woopen/nplayer) 为例。

```ts
import ProgressBar, { EVENT as BAR_EVENT } from 'ppbar';
import Player, { EVENT } from 'nplayer';
import 'ppbar/dist/index.min.css'

const div = document.createElement('div')
div.style.width = '100%'
const progress = new ProgressBar(div, {
  chapters: [
    { time: 10, title: 'chapter-a' },
    { time: 28, title: 'chapter-b' },
    { time: 51, title: 'chapter-c' },
    { title: 'chapter-d' },
  ],
  markers: [{
    time: 15,
    title: 'title1',
    image: 'https://github.com/web-streaming/ppbar/blob/main/demo/m1.png?raw=true',
    size: [32, 34],
  }, {
    time: 30,
    title: 'title2',
    image: 'https://github.com/web-streaming/ppbar/blob/main/demo/m2.png?raw=true',
    size: [32, 34],
  },
  {
    time: 55, 
    title: 'title3', 
    image: 'https://github.com/web-streaming/ppbar/blob/main/demo/m3.png?raw=true', 
    size: [32, 34],
  }],
  heatMap: {
    points: [9592,9692,10063,41138,30485,23905,10966.5,10316.5,8533.5,7249,7181,6813,5929,18046.5,8817,3684.5],
    defaultDuration: 3.75
  },
  thumbnail: {
    images: ['https://github.com/woopen/nplayer/blob/main/website/static/img/M1.jpg?raw=true']
  }
})

const MyProgress = {
  el: div,
  init(player) {
    player.on(EVENT.DURATION_CHANGE, () => progress.updateDuration(player.duration))
    player.on(EVENT.TIME_UPDATE, () => progress.updatePlayed(player.currentTime))
    player.on(EVENT.PROGRESS, () => progress.updateBuffer(player.buffered.end(player.buffered.length - 1)))
    // 监听播放器事件，关联到 ppbar
  }
}

const player = new Player({
  src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
  controls: [
    ['play', 'volume', 'time', 'spacer', 'settings', 'web-fullscreen', 'fullscreen'],
    [MyProgress]
  ]
})

progress.on(BAR_EVENT.DRAGEND, (time) => {
  player.currentTime = time
})
progress.on(BAR_EVENT.MARKER_CLICK, (marker) => {
  player.currentTime = marker.time
})
// 将 ppbar 事件关联到 player

player.mount(document.body)
```

效果如下。

![](./demo/c.png)

## API

### 配置

| 参数名 | 类型 | 描述 |
| -- | -- | -- |
| `live` | `boolean` | 是否是直播模式 |
| `duration` | `number` | 进度条的时长 |
| `rotate` | `0 \| 90 \| -90` | 进度条要被旋转的度数 |
| `dot` | `HTMLElement \| string \| true` | 进度条标记点，`true` 表示使用默认 |
| `chapters` | `{time?:number,title:string}[]` | 章节，`time` 是一个章节的结束时间，最后一个章节可以不设置 |
| `heatMap` | `Object` | 热力图 |
| `heatMap.points` | `(number\|{duration?:number;score:number})[]` | 热力图分数点 |
| `heatMap.defaultDuration` | `Object` | 默认单点时长 |
| `heatMap.hoverShow` | `Object` | 是否要 hover 的时候才展示 |
| `markers` | `Object[]` | 标记数组 |
| `markers[].time` | `number` | 必填，标记对应的时间点 |
| `markers[].title` | `string` | 标记点标题 |
| `markers[].el` | `HTMLElement` | 标记点自定义 DOM 元素 |
| `markers[].image` | `string` | 标记点图片 |
| `markers[].size` | `number[]` | 标记点图片大小 |
| `thumbnail` | `Object \| false` | 缩略图，`false` 为不展示 |
| `thumbnail.start` | `number` | 缩略图开始时间，默认 `0` |
| `thumbnail.gap` | `number` | 每个缩略图的时长，默认 `10` |
| `thumbnail.row` | `number` | 雪碧图由几行图片组成，默认 `5` |
| `thumbnail.col` | `number` | 雪碧图由几列图片组成，默认 `5` |
| `thumbnail.width` | `number` | 缩略图宽度，默认 `160` |
| `thumbnail.height` | `number` | 缩略图高度，默认 `90` |
| `thumbnail.images` | `string[]` | 缩略图地址数组 |

### 属性

| 属性 | 类型 | 描述 |
| -- | -- | -- |
| `el` | `HTMLElement` | 进度条的 DOM 元素 |
| `config` | `ProgressConfig` | 进度条参数 |
| `rect` | `Rect` | 进度条盒子大小，类似 [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) |
| `duration` | `number` | 时长，默认 `0` |
| `rotate` | `number` | 被旋转的角度，默认 `0` |
| `live` | `boolean` | 是否是直播模式 |

### 方法

#### updateSize()

更新进度条大小，一般在修改容器大小位置时调用，防止进度条中元素对不齐。

```ts
updateSize(): void;
```

### updateRotate()

更新进度条旋转角度。

```ts
updateRotate(r: 0 | 90 | -90): void
```

### updateDuration()

更新时长

```ts
updateDuration(duration?: number): void
```

### updateConfig()

更新进度条参数，参数可以部分更新，一般在切换视频时使用。

```ts
updateConfig(config?: Partial<ProgressConfig>): void
```

### updateMarkerPosition()

更新标记点的位置，在直播中随着时间推移可以标记点位置会发生变化，可以使用该函数。参数是相对时间，表示所有标记点都移动多少时间距离。

```ts
updateMarkerPosition(relativeTime: number): void
```

### updatePlayed()

更新播放进度。

```ts
updatePlayed(time: number): void
```

### updateBuffer()

更新缓存进度。

```ts
updateBuffer(time: number): void
```

### updateHover()

更新 hover 进度。

```ts
updateHover(time: number): void
```

### destroy()

销毁进度条。

```ts
destroy(): void
```

### 事件

| 事件名 | 描述 |
| -- | -- |
| `markerClick` | 标记点被点击，参数是标记点对象 | 
| `dragging` | 正在拖动进度条，频繁触发 |
| `dragend` | 拖动结束 |
| `mousemove` | 鼠标在进度条上移动，频繁触发 |
| `mouseleave` | 鼠标离开 |
