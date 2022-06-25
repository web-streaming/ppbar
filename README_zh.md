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

```js
import ProgressBar from 'ppbar';

const div = document.createElement('div');
const bar = new ProgressBar(div, {
  // 参数
})

document.body.appendChild(div)
```

### 章节

### 标记

### 热力图

### 缩略图

### 直播

### 旋转

### 事件

## 自定义样式

## 集成到播放器


## API

## 配置

| 参数名 | 类型 | 描述 |
| -- | -- | -- |
| `live` | `boolean` | 是否是直播模式 |
| `duration` | `number` | 是否是直播模式 |
| `rotate` | `0 | 90 | -90` | 是否是直播模式 |
| `dot` | `HTMLElement | string | true` | 是否是直播模式 |
| `chapters` | `{time?: number,title: string }[]` | 章节 |
| `heatMap` | `Object` | 是否是直播模式 |
| `heatMap.points` | `Object` | 是否是直播模式 |
| `heatMap.defaultDuration` | `Object` | 是否是直播模式 |
| `heatMap.hoverShow` | `Object` | 是否是直播模式 |
| `markers` | `Object[]` | 是否是直播模式 |
| `markers[].time` | `number` | 必填，标记对应的时间点 |
| `markers[].title` | `string` | 是否是直播模式 |
| `markers[].image` | `string` | 是否是直播模式 |
| `markers[].el` | `HTMLElement` | 是否是直播模式 |
| `markers[].size` | `number[]` | 是否是直播模式 |
| `thumbnail` | `Object` | 是否是直播模式 |
| `thumbnail.start` | `number` | 是否是直播模式 |
| `thumbnail.gap` | `number` | 是否是直播模式 |
| `thumbnail.row` | `number` | 是否是直播模式 |
| `thumbnail.col` | `number` | 是否是直播模式 |
| `thumbnail.width` | `number` | 是否是直播模式 |
| `thumbnail.height` | `number` | 是否是直播模式 |
| `thumbnail.images` | `string[]` | 是否是直播模式 |

## 属性

## 方法

### 事件
