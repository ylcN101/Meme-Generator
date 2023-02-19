'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

var gElCanvas
var gElContainer
var gCtx

var gStartPos

function onInit() {
  gElCanvas = document.querySelector('#canvas')
  gCtx = gElCanvas.getContext('2d')
  resizeCanvas()
  addListeners()
  renderMeme()
}

function renderMeme() {
  const meme = getMeme()
  renderImg(meme)
  renderText()
  renderInputMeme()
}

function addListeners() {
  addMouseListeners()
  window.addEventListener('resize', () => {
    renderMeme()
  })
}

function renderInputMeme() {
  const meme = getMeme()
  const elText = document.querySelector('.text-input')
  const { selectedLineIdx } = meme
  if (!meme.lines.length) {
    elText.value = ''
    return
  }

  if (meme.lines[selectedLineIdx].txt === 'Enter Text') {
    elText.value = ''
  } else {
    elText.value = meme.lines[selectedLineIdx].txt
  }
  // elText.focus()
}

function renderImg(meme) {
  if (!meme.selectedImgId) return
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

function onAddText(txt) {
  addText(txt)
  renderMeme()
}

function onSwitchLine() {
  switchLine()
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
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'block'
  var elSearch = document.querySelector('.search')
  elSearch.style.display = 'block'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'none'
  renderGallery()
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
  const imgs = getImgs()
  const strHtmls = imgs.map((img) => {
    if (img.keywords.includes(searchValue)) {
      return `<img src="${img.url}" onclick="onSelectImg(${img.id})" />`
    }
  })
  document.querySelector('.modal-gallery').innerHTML = strHtmls.join('')
  if (!searchValue) {
    renderGallery()
  }
}

function onGenerateRandomMeme() {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
  var elSearch = document.querySelector('.search')
  elSearch.style.display = 'none'

  generateRandomMeme()
  renderMeme()
}

function onSelectImg(imgId) {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
  var elSearch = document.querySelector('.search')
  elSearch.style.display = 'none'

  if (gMeme.lines.length) {
    gMeme.lines = []
    gMeme.selectedLineIdx = 0
  }

  selectImg(imgId)
  renderMeme()
}

function onHandleEmoji(emoji) {
  if (gMeme.lines.length === 3) return
  handleEmoji(emoji)
  renderMeme()
}

function onHandleAlignText(diff) {
  handleAlignText(diff)
  renderMeme()
}

function onHandleStrokeText() {
  handleStrokeText()
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

function showModal(msg) {
  const el = document.querySelector('.user-msg')
  el.innerText = msg
  el.classList.add('open')
  setTimeout(() => {
    el.classList.remove('open')
  }, 2000)
}

function onShowSavedMemes() {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'block'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'none'
  renderSavedMemes()
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

function onDownloadCanvas(elLink) {
  const data = gElCanvas.toDataURL()
  elLink.href = data
  elLink.download = 'my-meme'
}

function onShareImg() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    // Encode the instance of certain characters in the url
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
    )
  }
  // Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

//DRAG AND DROP

function onDown(ev) {
  const meme = getMeme()
  if (!meme.lines.length) return
  const pos = getEvPos(ev)
  const line = getLine()
  if (!isLineClicked(pos, line)) return
  setLineDrag(true)
  gStartPos = pos
}

function getCurrImg() {
  return gImgs.find((img) => img.id === gMeme.selectedImgId)
}

function onMove(ev) {
  const meme = getMeme()
  if (!meme.lines.length) return
  if (!isLineDrag()) return
  const pos = getEvPos(ev)
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  moveLine(dx, dy)
  gStartPos = pos
  renderMeme()
}

function onUp() {
  const meme = getMeme()
  if (!meme.lines.length) return
  setLineDrag(false)
  renderMeme()
}

function isLineDrag() {
  const meme = getMeme()
  return meme.lines[meme.selectedLineIdx].isDrag
}

function setLineDrag(isDrag) {
  var currLine = gMeme.lines[gMeme.selectedLineIdx]
  currLine.isDrag = isDrag
}
