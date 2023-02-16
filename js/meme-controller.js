'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

var gElCanvas
var gElContainer
var gCtx
var gFontFamily = 'Impact'
var gStartPos
var gIsDrag = false
var gDragIdx = null

function onInit() {
  gElCanvas = document.querySelector('#canvas')
  gCtx = gElCanvas.getContext('2d')
  resizeCanvas()
  addListeners()
  renderMeme()
}

function addListeners() {
  addMouseListeners()
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
}

function renderInputMeme() {
  const meme = getMeme()
  const elText = document.querySelector('.text-input')
  const { selectedLineIdx } = meme
  if (meme.lines[selectedLineIdx].txt === 'Enter Text') {
    elText.value = ''
  } else {
    elText.value = meme.lines[selectedLineIdx].txt
  }
  elText.focus()
}

function renderMeme() {
  const meme = getMeme()
  renderImg(meme)
  renderInputMeme()
}

function renderImg(meme) {
  const img = new Image()
  img.src = `img/${meme.selectedImgId}.jpg`
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    renderText()
  }
}

function onDrawText() {
  const meme = getMeme()
  // if user did noy choose an img
  if (!meme.selectedImgId) return

  // no lines
  if (!meme.lines.length) return

  meme.lines.forEach((line) => {
    drawText(line)
  })
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

function renderText(meme) {
  var meme = getMeme()
  meme.lines.forEach((textLine, idx) => {
    const { txt, size, align, color } = textLine
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
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

function onAddText(txt) {
  addText(txt)
  renderMeme()
}

function onMoveLine() {
  moveLine()
  renderMeme()
}

function onAddLine() {
  if (gMeme.lines.length === 3) return
  addLine()
  renderInputMeme()
  renderMeme()
}

function onRemoveElement() {
  deleteLine()
  renderMeme()
}

function onHandleSizeText(diff) {
  handleSizeText(diff)
  renderMeme()
}

function onShowGallery() {
  console.log('show gallery')
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'flex'
  var elSearch = document.querySelector('.search')
  elSearch.style.display = 'block'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'none'
  renderGallery()
}

function renderGallery() {
  var imgs = getImgs()
  var strHtmls = imgs.map((img) => {
    return `<img src="${img.url}" onclick="onSelectImg(${img.id})" />`
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
  createBtnForRandomMeme()
}

function createBtnForRandomMeme() {
  var elBtn = document.createElement('button')
  elBtn.innerText = 'Generate Random Meme'
  elBtn.classList.add('btn-random')
  elBtn.addEventListener('click', onGenerateRandomMeme)
  document.querySelector('.modal-gallery').appendChild(elBtn)
}

function onSearch() {
  const elSearch = document.querySelector('.search')
  const searchValue = elSearch.value
  console.log(searchValue)
  const imgs = getImgs()
  const strHtmls = imgs.map((img) => {
    if (img.keywords.includes(searchValue)) {
      return `<img src="${img.url}" onclick="onSelectImg(${img.id})" />`
    }
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
}

function onGenerateRandomMeme() {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
  generateRandomMeme()
  renderMeme()
}

function getImgs() {
  return gImgs
}

function onSelectImg(imgId) {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
  selectImg(imgId)
  renderMeme()
}

function onHandleEmoji(emoji) {
  handleEmoji(emoji)
  renderMeme()
}

function onHandleAlignText(diff) {
  handleAlignText(diff)
  renderMeme()
}

function onHandleStyleText() {
  handleStyleText()
  renderMeme()
}

function onHandleColorText(color) {
  handleColorText(color)
  renderMeme()
}

function onHandleFontText(font) {
  handleFontText(font)
  renderMeme()
}

function onSaveMeme() {
  saveMeme()
}

function onShowSavedMemes() {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'block'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'none'
  renderSavedMemes()
}

function renderSavedMemes() {
  var savedMemes = loadFromStorage('savedMemes')
  var strHtmls = savedMemes.map((meme) => {
    return `<img src="img/${meme.selectedImgId}.jpg" onclick="onSelectSavedMeme(${meme.selectedImgId})" />`
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
}

function onSelectSavedMeme(imgId) {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
  selectSavedMeme(imgId)
  renderMeme()
}

function onRefresh() {
  location.reload()
}
