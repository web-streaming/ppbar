import ProgressBar from '../src'

const c1 = document.createElement('div')

document.body.appendChild(c1)

const p1 = new ProgressBar(c1, {
  duration: 600
})
