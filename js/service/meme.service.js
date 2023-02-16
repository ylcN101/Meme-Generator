'use strict'

const STORAGE_KEY = 'memesDB'
var gSavedMemes = []

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
    },
  ],
}

function getMeme() {
  return gMeme
}

function addText(txt) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  if (!meme.lines.length) {
    const newLine = {
      txt: txt,
      size: 30,
      align: 'center',
      pos: { x: 250, y: 60 },
      color: getRandomColor(),
      isDrag: false,
    }
    meme.lines.push(newLine)
    return
  }

  meme.lines[selectedLineIdx].txt = txt
}

function addLine() {
  const meme = getMeme()
  const { selectedLineIdx } = meme

  if (selectedLineIdx === 1) {
    var posY = gElCanvas.height - 60
  } else if (selectedLineIdx === 2) {
    var posY = gElCanvas.height / 2
  }
  const newLine = {
    txt: 'Enter Text',
    size: 30,
    align: 'center',
    pos: { x: 250, y: posY },
    color: getRandomColor(),
  }

  meme.lines.splice(selectedLineIdx + 1, 0, newLine)
  meme.selectedLineIdx++
}

function deleteLine() {
  if (!gMeme.selectedLineIdx) return

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
  const newLine = {
    txt: emoji,
    size: 30,
    align: 'center',
    pos: { x: 250, y: 60 },
    color: getRandomColor(),
    isDrag: false,
  }

  meme.lines.splice(selectedLineIdx + 1, 0, newLine)
  meme.selectedLineIdx++
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
  gFontFamily = font
}

function saveMeme() {
  const meme = getMeme()
  var savedMemes = loadFromStorage('savedMemes')
  if (!savedMemes) savedMemes = []
  if (savedMemes.length === 0) {
    savedMemes.push(meme)
    saveToStorage('savedMemes', savedMemes)
  } else {
    const isMemeExist = savedMemes.some((savedMeme) => {
      return savedMeme.selectedImgId === meme.selectedImgId
    })
    if (!isMemeExist) {
      savedMemes.push(meme)

      saveToStorage('savedMemes', savedMemes)
    }
  }
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

function generateRandomMeme() {
  var imgs = getImgs()
  var randomImg = imgs[getRandomIntInclusive(0, imgs.length - 1)]
  selectImg(randomImg.id)
  var randomLines = getRandomIntInclusive(1, 3)
  for (var i = 0; i < randomLines; i++) {
    addLine()
  }
  var randomText = [
    'Hello',
    'Hi',
    'Bye',
    'Goodbye',
    'What?',
    'Why?',
    'How?',
    'When?',
    'Cool',
    'Nice',
    'Awesome',
    'Great',
    'Super',
    'Coding',
    'Programming',
    'Meme',
    'Funny',
  ]
  gMeme.lines.forEach((line) => {
    line.txt = randomText[getRandomIntInclusive(0, randomText.length - 1)]
  })

  var randomSize = [20, 30, 40, 50, 60]
  gMeme.lines.forEach((line) => {
    line.size = randomSize[getRandomIntInclusive(0, randomSize.length - 1)]
  })
  var randomAlign = ['left', 'center', 'right']
  gMeme.lines.forEach((line) => {
    line.align = randomAlign[getRandomIntInclusive(0, randomAlign.length - 1)]
  })
}

function selectSavedMeme(imgId) {
  var savedMemes = loadFromStorage('savedMemes')
  var meme = savedMemes.find((meme) => {
    return meme.selectedImgId === imgId
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
  const { txt, size, align, color } = line
  gCtx.lineWidth = 2
  gCtx.strokeStyle = 'black'
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${gFontFamily}`
  gCtx.textAlign = align
  gCtx.fillText(txt, line.pos.x, line.pos.y)
  gCtx.strokeText(txt, line.pos.x, line.pos.y)
}

function isLineClicked(clickedPos) {
  var isClickInLine = false
  const meme = getMeme()
  meme.lines.forEach((line, idx) => {
    var linePosX = line.pos.x
    var linePosY = line.pos.y
    if (
      clickedPos.x >= linePosX - 50 &&
      clickedPos.x <= linePosX + 50 &&
      clickedPos.y >= linePosY - 50 &&
      clickedPos.y <= linePosY + 50
    ) {
      isClickInLine = true
      meme.selectedLineIdx = idx
    }
  })
  return isClickInLine
}

function renderText(meme) {
  var meme = getMeme()
  meme.lines.forEach((textLine, idx) => {
    const { txt, size, align, color, stroke } = textLine
    gCtx.lineWidth = 2
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${gFontFamily}`
    gCtx.textAlign = align

    var posX
    var posY

    switch (align) {
      case 'left':
        posX = 10
        break
      case 'center':
        posX = gElCanvas.width / 2
        break
      case 'right':
        posX = gElCanvas.width - 10
        break
    }

    switch (idx) {
      case 0:
        posY = 50
        break
      case 1:
        posY = gElCanvas.height - 50
        break
      case 2:
        posY = gElCanvas.height / 2
        break
    }

    gCtx.fillText(txt, posX, posY, gElCanvas.width)
    gCtx.strokeText(txt, posX, posY, gElCanvas.width)
  })
}

function renderGallery() {
  var imgs = getImgs()
  var strHtmls = imgs.map((img) => {
    return `<img src="${img.url}" onclick="onSelectImg(${img.id})" />`
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
  createBtnForRandomMeme()
}

function getImgs() {
  return gImgs
}

function handleStrokeText() {
  var meme = getMeme()
  meme.lines.forEach((line) => {
    if (line.stroke === 'black') {
      line.stroke = getRandomColor()
    } else {
      line.stroke = 'black'
    }
  })
}

function renderSavedMemes() {
  var savedMemes = loadFromStorage('savedMemes')
  //we want to render the current url of the meme
  var strHtmls = savedMemes.map((meme) => {
    return `<img src="img/${meme.selectedImgId}.jpg"
    onclick="onSelectSavedMeme(${meme.selectedImgId})" />`
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
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
