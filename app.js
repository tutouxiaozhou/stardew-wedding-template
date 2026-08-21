import rsvpConfig from './rsvp-config.js'

const weddingConfig = {
  groom: '王子宇',
  bride: '李嘉伟',
  groomLatin: 'WANG ZIYU',
  brideLatin: 'LI JIAWEI',
  weddingDate: '2026-09-15T11:30:00+08:00',
  dateDot: '2026.9.15',
  dateCn: '2026年9月15日 · 星期二',
  calendarMonth: 'Nov',
  calendarDay: '15',
  calendarYear: '2026',
  venue: '博兴爱丁堡禧悦宴会酒店（3号厅）',
  venueShort: '奥斯卡黑金厅',
  navigationUrl: 'https://ditu.amap.com/search?id=B0J22C0QR7&city=371625&geoobj=116.776339%7C36.747911%7C119.971644%7C38.066552&query_type=IDQ&query=%E7%88%B1%E4%B8%81%E5%A0%A1%E7%A6%A7%E6%82%A6%E5%AE%B4%E4%BC%9A%E9%85%92%E5%BA%97&zoom=9.3',
  schedule: [
    { label: '签到', time: '待确认', description: '领取今日任务，与老朋友相见' },
    { label: '仪式', time: '待确认', description: '见证拥抱、誓言与交换戒指' },
    { label: '喜宴', time: '待确认', description: '共享一场丰盛的秋日宴席' },
    { label: '合影', time: '待确认', description: '保存这一份快乐存档' },
  ],
}

const contentValues = {
  couple: `${weddingConfig.groom} × ${weddingConfig.bride}`,
  coupleAmp: `${weddingConfig.groom} & ${weddingConfig.bride}`,
  groomLatin: weddingConfig.groomLatin,
  brideLatin: weddingConfig.brideLatin,
  dateDot: weddingConfig.dateDot,
  dateCn: weddingConfig.dateCn,
  calendarMonth: weddingConfig.calendarMonth,
  calendarDay: weddingConfig.calendarDay,
  calendarYear: weddingConfig.calendarYear,
  venue: weddingConfig.venue,
  venueShort: weddingConfig.venueShort,
}

document.querySelectorAll('[data-content]').forEach((element) => {
  const key = element.dataset.content
  if (key in contentValues) element.textContent = contentValues[key]
  if (key === 'navigationLink') element.href = weddingConfig.navigationUrl
})

const scheduleGrid = document.querySelector('[data-content="schedule"]')
weddingConfig.schedule.forEach((item, index) => {
  const article = document.createElement('article')
  article.className = 'schedule-item'

  const number = document.createElement('span')
  number.className = 'schedule-index'
  number.textContent = String(index + 1).padStart(2, '0')

  const heading = document.createElement('b')
  heading.textContent = item.label
  const time = document.createElement('small')
  time.textContent = item.time
  heading.append(time)

  const description = document.createElement('p')
  description.textContent = item.description
  article.append(number, heading, description)
  scheduleGrid.append(article)
})

const weddingDate = new Date(weddingConfig.weddingDate)
const days = Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / 86400000))
document.querySelector('#days-count').textContent = String(days)

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

if (rsvpConfig.enabled) {
  document.querySelectorAll('[data-rsvp-ui], [data-rsvp-shortcut]').forEach((element) => {
    element.hidden = false
  })
  import('./rsvp-client.js').then(({ initializeRsvp }) => initializeRsvp(rsvpConfig))
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const revealElements = document.querySelectorAll('.reveal')

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }),
    { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
  )
  revealElements.forEach((element) => observer.observe(element))

  const animationObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      entry.target.classList.toggle('animations-paused', !entry.isIntersecting)
    }),
    { rootMargin: '25% 0px' },
  )
  document.querySelectorAll('.hero, .story-section, .ending').forEach((region) => animationObserver.observe(region))
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'))
}

const stars = document.querySelector('.sky-stars')
for (let index = 0; index < 34; index += 1) {
  const star = document.createElement('i')
  star.style.left = `${(index * 37 + 11) % 97}%`
  star.style.top = `${(index * 53 + 7) % 82}%`
  star.style.setProperty('--twinkle', `${1.4 + (index % 5) * 0.35}s`)
  star.style.animationDelay = `${-(index % 7) * 0.27}s`
  stars.append(star)
}

document.querySelectorAll('.pixel-petals').forEach((petalField, fieldIndex) => {
  for (let index = 0; index < 12; index += 1) {
    const petal = document.createElement('i')
    petal.style.left = `${5 + ((index * 19 + fieldIndex * 11) % 91)}%`
    petal.style.setProperty('--fall', `${4.8 + (index % 4) * 0.8}s`)
    petal.style.setProperty('--delay', `${-(index * 0.63)}s`)
    petalField.append(petal)
  }
})

if (!reducedMotion.matches) {
  const heroMountains = document.querySelector('.hero-mountains')
  let parallaxFrame
  let lastParallaxOffset
  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.055, 30)
    if (offset !== lastParallaxOffset) {
      heroMountains.style.setProperty('--parallax-y', `${offset}px`)
      lastParallaxOffset = offset
    }
    parallaxFrame = undefined
  }
  window.addEventListener('scroll', () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax)
  }, { passive: true })
}

const music = document.querySelector('#wedding-music')
const musicButton = document.querySelector('#music-toggle')
const audioStatus = document.querySelector('#audio-status')
let fadeFrame
let resumeAfterVisibility = false
let fileUnavailable = false
let currentMusicMode
let synthContext
let synthMaster
let synthTimer
let synthStopTimer
let noteIndex = 0

const synthMelody = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23, 440, 587.33, 440, 349.23]

function setMusicState(playing) {
  musicButton.classList.toggle('playing', playing)
  musicButton.setAttribute('aria-pressed', String(playing))
  musicButton.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐')
  audioStatus.textContent = playing ? '背景音乐正在播放' : '背景音乐已暂停'
}

function fadeVolume(target, duration = 650) {
  window.cancelAnimationFrame(fadeFrame)
  const start = music.volume
  const startedAt = performance.now()
  return new Promise((resolve) => {
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      music.volume = start + (target - start) * progress
      if (progress < 1) fadeFrame = window.requestAnimationFrame(step)
      else resolve()
    }
    fadeFrame = window.requestAnimationFrame(step)
  })
}

function ensureSynth() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) throw new Error('Web Audio API is unavailable')
  synthContext ||= new AudioContextClass()
  if (!synthMaster) {
    synthMaster = synthContext.createGain()
    synthMaster.gain.value = 0.0001
    synthMaster.connect(synthContext.destination)
  }
}

function playSynthNote(frequency) {
  const oscillator = synthContext.createOscillator()
  const gain = synthContext.createGain()
  oscillator.type = 'square'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.8, synthContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, synthContext.currentTime + 0.22)
  oscillator.connect(gain).connect(synthMaster)
  oscillator.start()
  oscillator.stop(synthContext.currentTime + 0.23)
}

async function startSynthMusic() {
  if (synthTimer) return
  try {
    ensureSynth()
    window.clearTimeout(synthStopTimer)
    await synthContext.resume()
    synthMaster.gain.cancelScheduledValues(synthContext.currentTime)
    synthMaster.gain.setValueAtTime(Math.max(0.0001, synthMaster.gain.value), synthContext.currentTime)
    synthMaster.gain.linearRampToValueAtTime(0.2, synthContext.currentTime + 0.55)
    playSynthNote(synthMelody[noteIndex])
    synthTimer = window.setInterval(() => {
      noteIndex = (noteIndex + 1) % synthMelody.length
      playSynthNote(synthMelody[noteIndex])
    }, 310)
    currentMusicMode = 'synth'
    setMusicState(true)
    audioStatus.textContent = '未检测到背景音乐文件，正在播放合成像素旋律'
  } catch {
    currentMusicMode = undefined
    setMusicState(false)
    audioStatus.textContent = '浏览器暂未允许播放背景音乐，请检查静音设置后重试'
  }
}

function stopSynthMusic() {
  window.clearInterval(synthTimer)
  synthTimer = undefined
  if (!synthContext || !synthMaster) return
  synthMaster.gain.cancelScheduledValues(synthContext.currentTime)
  synthMaster.gain.setValueAtTime(Math.max(0.0001, synthMaster.gain.value), synthContext.currentTime)
  synthMaster.gain.exponentialRampToValueAtTime(0.0001, synthContext.currentTime + 0.28)
  synthStopTimer = window.setTimeout(() => synthContext.suspend(), 320)
}

function isMusicPlaying() {
  return currentMusicMode === 'synth' ? Boolean(synthTimer) : currentMusicMode === 'file' && !music.paused
}

async function playMusic() {
  if (fileUnavailable) {
    await startSynthMusic()
    return
  }

  try {
    music.volume = 0
    await music.play()
    currentMusicMode = 'file'
    setMusicState(true)
    await fadeVolume(0.2)
  } catch (error) {
    if (music.error || error?.name === 'NotSupportedError') {
      fileUnavailable = true
      await startSynthMusic()
      return
    }
    setMusicState(false)
    audioStatus.textContent = '浏览器暂未允许播放背景音乐'
  }
}

async function pauseMusic() {
  if (currentMusicMode === 'synth') {
    stopSynthMusic()
    setMusicState(false)
    return
  }
  await fadeVolume(0, 320)
  music.pause()
  setMusicState(false)
}

music.addEventListener('canplay', () => { fileUnavailable = false }, { once: true })
music.addEventListener('error', () => {
  fileUnavailable = true
  if (currentMusicMode === 'file') startSynthMusic()
})
musicButton.addEventListener('click', () => { isMusicPlaying() ? pauseMusic() : playMusic() })
window.setTimeout(() => { playMusic() }, 0)

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resumeAfterVisibility = isMusicPlaying()
    if (resumeAfterVisibility) {
      music.pause()
      stopSynthMusic()
      setMusicState(false)
    }
  } else if (resumeAfterVisibility) {
    resumeAfterVisibility = false
    playMusic()
  }
})

window.addEventListener('pagehide', () => {
  music.pause()
  stopSynthMusic()
  window.cancelAnimationFrame(fadeFrame)
})
