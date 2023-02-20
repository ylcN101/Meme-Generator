'use strict'

const STORAGE_KEY = 'memesDB'
var gIsRect = false
var gSavedMemes = []
var gFontFamily = 'Impact'
var gKeyWordSearchCountMap = { funny: 10, cat: 4, baby: 1 }

var gImgs = [
  {
    id: 1,
    url: 'img/1.jpg',
    keywords: ['funny', 'cute'],
  },
  {
    id: 2,
    url: 'img/2.jpg',
    keywords: [, 'animals', 'happy'],
  },
  {
    id: 3,
    url: 'img/3.jpg',
    keywords: ['funny', 'happy'],
  },
  {
    id: 4,
    url: 'img/4.jpg',
    keywords: ['funny'],
  },
  {
    id: 5,
    url: 'img/5.jpg',
    keywords: ['animals'],
  },
  {
    id: 6,
    url: 'img/6.jpg',
    keywords: ['baby', 'happy'],
  },
  {
    id: 7,
    url: 'img/7.jpg',
    keywords: ['funny', 'cute', 'animals', 'baby', 'happy'],
  },
  {
    id: 8,

    url: 'img/8.jpg',
    keywords: ['animals'],
  },
  {
    id: 9,
    url: 'img/9.jpg',
    keywords: ['happy'],
  },
  {
    id: 10,
    url: 'img/10.jpg',
    keywords: ['happy'],
  },
  {
    id: 11,
    url: 'img/11.jpg',
    keywords: ['funny'],
  },
  {
    id: 12,
    url: 'img/12.jpg',
    keywords: ['funny'],
  },
  {
    id: 13,
    url: 'img/13.jpg',
    keywords: ['cute'],
  },
  {
    id: 14,
    url: 'img/14.jpg',
    keywords: ['baby'],
  },
  {
    id: 15,
    url: 'img/15.jpg',
    keywords: ['funny', 'baby', 'happy'],
  },
  {
    id: 16,
    url: 'img/16.jpg',
    keywords: ['funny'],
  },
  {
    id: 17,
    url: 'img/17.jpg',
    keywords: ['animals'],
  },
  {
    id: 18,
    url: 'img/18.jpg',
    keywords: ['animals'],
  },
]

var gMeme = {
  selectedImgId: 2,
  selectedLineIdx: 0,

  lines: [
    {
      txt: 'Enter Text',
      size: 30,
      align: 'center',
      stroke: 'black',
      pos: { x: 250, y: 35 },
      color: 'lightblue',
      isDrag: false,
      font: 'Impact',
    },
  ],
}

function getMeme() {
  return gMeme
}

function renderKeyWordSearchCountMap() {
  const elKeyWordSearchCountMap = document.querySelector('.key-word-count')
  const strHtmls = Object.keys(gKeyWordSearchCountMap).map((key) => {
    return `<span onclick="onSearch('${key}')">${key} (${gKeyWordSearchCountMap[key]})</span>`
  })
  elKeyWordSearchCountMap.innerHTML = strHtmls.join('')
}

function renderSearch(searchValue) {
  if (!searchValue) {
    renderGallery()
    return
  }

  const filteredImgs = gImgs.filter((img) => {
    return img.keywords.includes(searchValue)
  })
  const strHtmls = filteredImgs.map((img) => {
    return `<img src="img/${img.id}.jpg" onclick="onSelectImg(${img.id})">`
  })
  const elGallery = document.querySelector('.modal-gallery')
  elGallery.innerHTML = strHtmls.join('')
}

function addText(txt) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  if (!meme.lines.length) {
    meme.lines.push({
      txt,
      size: 30,
      align: 'center',
      font: 'Impact',
      pos: { x: 250, y: 35 },
      color: getRandomColor(),
      isDrag: false,
      stroke: 'black',
    })
  } else meme.lines[selectedLineIdx].txt = txt
}

function updateLineDiff(selectedLineIdx) {
  if (selectedLineIdx === 0) return { x: 250, y: 100 }
  else if (selectedLineIdx === 1) return { x: 250, y: 250 }
  else if (selectedLineIdx === 2) return { x: 250, y: 400 }
}

function addLine() {
  const meme = getMeme()
  const { selectedLineIdx } = meme

  const newLine = {
    txt: 'Enter Text',
    size: 30,
    align: 'center',
    font: 'Impact',
    pos: updateLineDiff(selectedLineIdx),
    color: getRandomColor(),
    isDrag: false,
    stroke: 'black',
  }

  meme.lines.splice(selectedLineIdx + 1, 0, newLine)
  meme.selectedLineIdx++
}

function deleteLine() {
  if (!gMeme.selectedLineIdx) {
    showModal('You can not delete the first line')
    return
  }

  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines.splice(selectedLineIdx, 1)
  meme.selectedLineIdx--
  if (meme.selectedLineIdx <= 0) meme.selectedLineIdx = 0
}

function handleSizeText(diff) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].size += diff
}

function handleAlignText(diff) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].align = diff
}

function handleEmoji(emoji) {
  //we want to add emoji like a new line inside the canvas
  const meme = getMeme()
  const { selectedLineIdx } = meme
  if (!meme.lines.length) {
    meme.lines.push({
      txt: emoji,
      size: 30,
      align: 'center',
      font: 'Impact',
      pos: { x: 250, y: 35 },
      color: getRandomColor(),
      isDrag: false,
      stroke: 'black',
    })
  }
  addLine()
  meme.lines[selectedLineIdx + 1].txt = emoji
}

function selectImg(imgId) {
  gMeme.selectedImgId = imgId
}

function handleStyleText() {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  const line = meme.lines[selectedLineIdx]
  if (line.color === 'white') {
    line.color = 'black'
  } else {
    line.color = 'white'
  }
}

function handleColorText(color) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].color = color
}

function handleFontText(font) {
  //we need to change the font of the text in the canvas only to the selected line
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].font = font
}

function saveMeme(memeUrl) {
  gMeme.id = Date.now()
  console.log(gMeme)
  gMeme.currImg = memeUrl
  var savedMemes = loadFromStorage('savedMemes')
  console.log(savedMemes)
  if (!savedMemes) savedMemes = []
  if (savedMemes.length) {
    const meme = savedMemes.find((meme) => {
      return meme.currImg === gMeme.currImg
    })
    if (meme) {
      showModal('Meme already exist')
      return
    }
  }
  savedMemes.push(gMeme)
  showModal('Meme saved')
  saveToStorage('savedMemes', savedMemes)
}

function getImgById(imgId) {
  const imgs = getImgs()
  const img = imgs.find((img) => {
    return img.id === imgId
  })
  return img
}

function getSavedMemes() {
  return loadFromStorage('savedMemes')
}

function getRandomPos() {
  const pos = {
    x: getRandomIntInclusive(100, 250),
    y: getRandomIntInclusive(100, 400),
  }
  return pos
}

function generateRandomMeme() {
  if (!gImgs.length) return
  const imgs = getImgs()
  const randomImg = imgs[getRandomIntInclusive(0, imgs.length)]
  const randomLines = getRandomIntInclusive(1, 2)
  for (let i = 0; i < randomLines; i++) {
    addLine()
  }
  const meme = getMeme()
  meme.lines.forEach((line) => {
    line.pos = getRandomPos()
    line.color = getRandomColor()
    line.txt = makeLorem()
  })
  meme.selectedImgId = randomImg.id
}

function updateText(txt) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].txt = txt
}

function selectSavedMeme(imgId) {
  var imgId = +imgId
  const savedMemes = loadFromStorage('savedMemes')
  const meme = savedMemes.find((meme) => {
    return meme.id === imgId
  })
  gMeme = meme
}

function moveLine(dx, dy) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].pos.x += dx
  meme.lines[selectedLineIdx].pos.y += dy
}

function switchLine() {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  if (selectedLineIdx === meme.lines.length - 1) {
    meme.selectedLineIdx = 0
  } else {
    meme.selectedLineIdx++
  }
}

function getLine() {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  return meme.lines[selectedLineIdx]
}

function drawText(line) {
  const { txt, size, align, pos, color, font, stroke } = line
  gCtx.lineWidth = '2'
  gCtx.strokeStyle = stroke
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = align
  gCtx.fillText(txt, pos.x, pos.y)
  gCtx.strokeText(txt, pos.x, pos.y)
  const textWidth = gCtx.measureText(txt).width
  const textHeight = size
  const textPos = { x: pos.x - textWidth / 2, y: pos.y - textHeight }

  return textPos
}

function isLineClicked(clickedPos) {
  //we need to know the pos of all the lines in the canvas
  const meme = getMeme()
  return meme.lines.some((line, idx) => {
    const { size } = line
    const { pos } = line
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = size
    if (
      clickedPos.x >= pos.x - textWidth / 2 &&
      clickedPos.x <= pos.x + textWidth / 2 &&
      clickedPos.y >= pos.y - textHeight &&
      clickedPos.y <= pos.y
    ) {
      meme.selectedLineIdx = idx
      return true
    }
  })
}

function renderText(meme) {
  var meme = getMeme()
  meme.lines.forEach((line) => {
    drawText(line)
  })
}

function renderGallery() {
  var imgs = getImgs()
  var strHtmls = imgs.map((img) => {
    return `<img src="${img.url}" onclick="onSelectImg(${img.id})" />`
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
}

function getImgs() {
  return gImgs
}

function handleStrokeText() {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  if (meme.lines[selectedLineIdx].stroke === 'black') {
    meme.lines[selectedLineIdx].stroke = getRandomColor()
  } else {
    meme.lines[selectedLineIdx].stroke = 'black'
  }
}

function loadImageFromInput(ev, onImageReady) {
  const reader = new FileReader()
  // After we read the file
  reader.onload = function (event) {
    let img = new Image() // Create a new html img element
    img.src = event.target.result // Set the img src to the img file we read
    // Run the callBack func, To render the img on the canvas
    img.onload = onImageReady.bind(null, img)
    // Can also do it this way:
    // img.onload = () => onImageReady(img)
  }
  reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function renderRecOnText(line) {
  const { size } = line
  const { pos } = line
  const strokeColor = 'white'
  const textWidth = gCtx.measureText(line.txt).width
  const textHeight = size
  gCtx.beginPath()
  gCtx.rect(
    pos.x - textWidth / 2 - 5,
    pos.y - textHeight,
    textWidth + 10,
    textHeight + 10
  )
  gCtx.strokeStyle = strokeColor
  gCtx.stroke()
}
