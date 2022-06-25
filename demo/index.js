import ProgressBar from '../src'
import m1 from './m1.png'
import m2 from './m2.png'
import m3 from './m3.png'
import t1 from './t1.jpg'
import t2 from './t2.jpg'
import t3 from './t3.jpg'

const p = document.getElementById('c')
const buffer = document.getElementById('buffer')
const rotate = document.getElementById('rotate')
const live = document.getElementById('live')
const youtube = document.getElementById('youtube')
const bilibili = document.getElementById('bilibili')

const cfg = {
  dot: true,
  duration: 600,
  live: false,
  chapters: [
    { time: 100, title: 'chapter-a' },
    { time: 280, title: 'chapter-b' },
    { time: 510, title: 'chapter-c' },
    { title: 'chapter-d' },
  ],
  markers: [{
    time: 150,
    title: 'title1',
    image: m1,
    size: [32, 34],
  }, {
    time: 300,
    title: 'title2',
    image: m2,
    size: [32, 34],
  },
  {
    time: 550, title: 'title3', image: m3, size: [32, 34],
  }],
  heatMap: {
    points: getHeatPoints(),
    defaultDuration: 7.5
  },
  thumbnail: {
    images: [t1,t2,t3]
  }
}
const ytbCfg = {
  dot: true,
  chapters: [
    { time: 100, title: 'chapter-a' },
    { time: 280, title: 'chapter-b' },
    { time: 510, title: 'chapter-c' },
    { title: 'chapter-d' },
  ],
  markers: [],
  heatMap: {
    points: getHeatPoints(),
    hoverShow: true,
    defaultDuration: 7.5
  }
}
const bCfg = {
  dot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="__lottie_element_25"><rect width="18" height="18" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_25)"><g transform="matrix(1,0,0,1,8.937000274658203,8.25)" opacity="0.14" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0.07500000298023224,1.2130000591278076)"><path fill="rgb(251,114,153)" fill-opacity="1" d=" M9,-3.5 C9,-3.5 9,3.5 9,3.5 C9,5.707600116729736 7.207600116729736,7.5 5,7.5 C5,7.5 -5,7.5 -5,7.5 C-7.207600116729736,7.5 -9,5.707600116729736 -9,3.5 C-9,3.5 -9,-3.5 -9,-3.5 C-9,-5.707600116729736 -7.207600116729736,-7.5 -5,-7.5 C-5,-7.5 5,-7.5 5,-7.5 C7.207600116729736,-7.5 9,-5.707600116729736 9,-3.5z"></path></g></g><g transform="matrix(1,0,0,1,9.140999794006348,8.67199993133545)" opacity="0.28" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-0.1509999930858612,0.7990000247955322)"><path fill="rgb(251,114,153)" fill-opacity="1" d=" M8,-3 C8,-3 8,3 8,3 C8,4.931650161743164 6.431650161743164,6.5 4.5,6.5 C4.5,6.5 -4.5,6.5 -4.5,6.5 C-6.431650161743164,6.5 -8,4.931650161743164 -8,3 C-8,3 -8,-3 -8,-3 C-8,-4.931650161743164 -6.431650161743164,-6.5 -4.5,-6.5 C-4.5,-6.5 4.5,-6.5 4.5,-6.5 C6.431650161743164,-6.5 8,-4.931650161743164 8,-3z"></path></g></g><g transform="matrix(0.9883429408073425,-0.7275781631469727,0.6775955557823181,0.920446515083313,7.3224687576293945,-0.7606706619262695)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.9937776327133179,-0.11138220876455307,0.11138220876455307,0.9937776327133179,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(0,0,0)" fill-opacity="1" d=" M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z"></path></g></g><g transform="matrix(1.1436611413955688,0.7535901665687561,-0.6317168474197388,0.9587040543556213,16.0070743560791,2.902894973754883)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(0.992861807346344,0.1192704513669014,-0.1192704513669014,0.992861807346344,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(0,0,0)" fill-opacity="1" d=" M0.75,-1.25 C0.75,-1.25 0.75,1.25 0.75,1.25 C0.75,1.663925051689148 0.4139249920845032,2 0,2 C0,2 0,2 0,2 C-0.4139249920845032,2 -0.75,1.663925051689148 -0.75,1.25 C-0.75,1.25 -0.75,-1.25 -0.75,-1.25 C-0.75,-1.663925051689148 -0.4139249920845032,-2 0,-2 C0,-2 0,-2 0,-2 C0.4139249920845032,-2 0.75,-1.663925051689148 0.75,-1.25z"></path></g></g><g transform="matrix(1,0,0,1,8.890999794006348,8.406000137329102)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0.09099999815225601,1.1009999513626099)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z"></path><path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="1.5" d=" M7,-3 C7,-3 7,3 7,3 C7,4.379749774932861 5.879749774932861,5.5 4.5,5.5 C4.5,5.5 -4.5,5.5 -4.5,5.5 C-5.879749774932861,5.5 -7,4.379749774932861 -7,3 C-7,3 -7,-3 -7,-3 C-7,-4.379749774932861 -5.879749774932861,-5.5 -4.5,-5.5 C-4.5,-5.5 4.5,-5.5 4.5,-5.5 C5.879749774932861,-5.5 7,-4.379749774932861 7,-3z"></path></g></g><g transform="matrix(1,0,0,1,8.89900016784668,8.083999633789062)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(0,0,0)" fill-opacity="1" d=" M0.875,-1.125 C0.875,-1.125 0.875,1.125 0.875,1.125 C0.875,1.607912540435791 0.48291251063346863,2 0,2 C0,2 0,2 0,2 C-0.48291251063346863,2 -0.875,1.607912540435791 -0.875,1.125 C-0.875,1.125 -0.875,-1.125 -0.875,-1.125 C-0.875,-1.607912540435791 -0.48291251063346863,-2 0,-2 C0,-2 0,-2 0,-2 C0.48291251063346863,-2 0.875,-1.607912540435791 0.875,-1.125z"></path></g></g><g transform="matrix(1,0,0,1,14.008999824523926,8.083999633789062)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-2.5239999294281006,1.3849999904632568)"><path fill="rgb(0,0,0)" fill-opacity="1" d=" M0.8999999761581421,-1.100000023841858 C0.8999999761581421,-1.100000023841858 0.8999999761581421,1.100000023841858 0.8999999761581421,1.100000023841858 C0.8999999761581421,1.596709966659546 0.4967099726200104,2 0,2 C0,2 0,2 0,2 C-0.4967099726200104,2 -0.8999999761581421,1.596709966659546 -0.8999999761581421,1.100000023841858 C-0.8999999761581421,1.100000023841858 -0.8999999761581421,-1.100000023841858 -0.8999999761581421,-1.100000023841858 C-0.8999999761581421,-1.596709966659546 -0.4967099726200104,-2 0,-2 C0,-2 0,-2 0,-2 C0.4967099726200104,-2 0.8999999761581421,-1.596709966659546 0.8999999761581421,-1.100000023841858z"></path></g></g></g></svg>`,
  chapters: [],
  markers: [{
    time: 150,
    title: 'title1',
    image: m1,
    size: [32, 34],
  }, {
    time: 300,
    title: 'title2',
    image: m2,
    size: [32, 34],
  },
  {
    time: 550, title: 'title3', image: m3, size: [32, 34],
  }],
  heatMap: {
    points: getHeatPoints(),
    defaultDuration: 7.5
  }
}


const pb = new ProgressBar(p, cfg)

setTimeout(function () {
  pb.updateSize()
}, 1000)

pb.updateBuffer(6 * buffer.value)
buffer.onchange = function() {
  pb.updateBuffer(6 * buffer.value)
}

pb.on('markerClick', function (m) {
  pb.updatePlayed(m.time)
})

rotate.onchange = function() {
  const v = rotate.value ? Number(rotate.value) : 0
  if (v === 90) {
    pb.updateRotate(90)
    p.style.width = '300px'
    p.style.transform = 'rotate(90deg)'
  } else if (v === -90) {
    pb.updateRotate(-90)
    p.style.width = '300px'
    p.style.transform = 'rotate(-90deg)'
  } else {
    pb.updateRotate(0)
    p.style.width = ''
    p.style.transform = ''
  }
}

live.onchange = function() {
  pb.updateConfig({
    live: !!live.checked
  })
}

youtube.onchange = function() {
  if (youtube.checked) {
    if (bilibili.checked) bilibili.checked = false
    pb.updateConfig(ytbCfg)
  } else {
    pb.updateConfig(cfg)
  }
  pb.el.style.setProperty('--primary-color', '#f00');
  pb.updatePlayed(0)
  pb.updateBuffer(6 * buffer.value)
}

bilibili.onchange = function() {
  if (bilibili.checked) {
    if (youtube.checked) youtube.checked = false
    pb.updateConfig(bCfg)
    pb.el.style.setProperty('--primary-color', 'rgba(35,173,229, 1)');

  } else {
    pb.updateConfig(cfg)
    pb.el.style.setProperty('--primary-color', '#f00');
  }
  pb.updatePlayed(0)
  pb.updateBuffer(6 * buffer.value)
}

function getHeatPoints() {
  return [
    9592,
    9692,
    10063,
    41138,
    30485,
    23905,
    10966.5,
    10316.5,
    8533.5,
    7249,
    7181,
    6813,
    5929,
    18046.5,
    8817,
    3684.5,
    4863.5,
    7818,
    11122,
    11977.5,
    12045.5,
    6882,
    8616,
    3389.5,
    2791.5,
    2378,
    2415,
    3561.5,
    4563.5,
    5351,
    5166,
    3649.5,
    3817.5,
    6808,
    3503,
    2831.5,
    2617.5,
    2401,
    2149,
    2478.5,
    2498.5,
    2311.5,
    1843.5,
    1800,
    2101,
    2002.5,
    2882.5,
    3380,
    3880,
    3966,
    3257,
    8804,
    5440,
    6468,
    6432,
    3885,
    3611,
    7348,
    11954,
    12317,
    5834,
    1549.5,
    1658.5,
    1649,
    2053,
    3831.5,
    6050.5,
    7764,
    8290,
    8549,
    5757,
    1898,
    1393,
    1263.5,
    1356.5,
    2841,
    5774,
    4294,
    1798,
    1260.5,
  ];
}
