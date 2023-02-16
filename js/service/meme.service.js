'use strict'

const STORAGE_KEY = 'memesDB'
var gSavedMemes = []

var gKeyWordSearchCountMap = { funny: 10, cat: 4, baby: 1 }

var gImgs = [
  //put keywords in array in random (for search) (funny,cute,animals,baby,happy)
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
  meme.lines[selectedLineIdx].txt = txt
}

function addLine() {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  //we need to know the position of the line we want to add by the selectedLineIdx
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

//   const newLine = {
//     txt: 'Enter Text',
//     size: 30,
//     align: 'center',
//     pos: { x: 250, y: 35 },
//     color: getRandomColor(),
//   }
//   meme.lines.splice(selectedLineIdx + 1, 0, newLine)
//   meme.selectedLineIdx++
// }

function deleteLine() {
  if (!gMeme.selectedLineIdx) return

  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines.splice(selectedLineIdx, 1)
  meme.selectedLineIdx--
  if (meme.selectedLineIdx <= 0) meme.selectedLineIdx = 0
  console.log(meme)
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

  console.log(meme)
}

function handleEmoji(emoji) {
  const meme = getMeme()
  const { selectedLineIdx } = meme
  meme.lines[selectedLineIdx].txt += emoji
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

function moveLine() {
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

// function getTextSize(txt) {
//   const meme = getMeme()
//   const { selectedLineIdx } = meme
//   const line = meme.lines[selectedLineIdx]
//   gCtx.font = `${line.size}px ${gFontFamily}`
//   const width = gCtx.measureText(txt).width
//   const height = line.size
//   return { width, height }
// }

// function isLineClicked(clickedPos) {
//   //in this function we need to check if the user clicked on the line
//   //we need to know the position of the line
//   //we need to know the size of the line
//   //we can know the line by the selectedLineIdx and the lines array aand his align

//   const meme = getMeme()
//   const { selectedLineIdx } = meme
//   const line = meme.lines[selectedLineIdx]
//   const { width, height } = getTextSize(line.txt)
//   const { x, y } = line.pos
//   // console.log(line)
//   console.log(width, height, x, y)
//   if (line.align === 'center') {
//     if (
//       clickedPos.x >= x - width / 2 &&
//       clickedPos.x <= x + width / 2 &&
//       clickedPos.y >= y - height / 2 &&
//       clickedPos.y <= y + height / 2
//     ) {
//       return true
//     }
//   } else if (line.align === 'left') {
//     if (
//       clickedPos.x >= x &&
//       clickedPos.x <= x + width &&
//       clickedPos.y >= y - height / 2 &&
//       clickedPos.y <= y + height / 2
//     ) {
//       return true
//     }
//   } else if (line.align === 'right') {
//     if (
//       clickedPos.x >= x - width &&
//       clickedPos.x <= x &&
//       clickedPos.y >= y - height / 2 &&
//       clickedPos.y <= y + height / 2
//     ) {
//       return true
//     }
//   }
//   return false
// }
