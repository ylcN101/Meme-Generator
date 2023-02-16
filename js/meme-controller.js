'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

var gElCanvas
var gElContainer
var gCtx
var gFontFamily = 'Impact'
var gStartPos

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
    renderCanvas()
  })
}

function renderCanvas() {
  const meme = getMeme()
  const img = new Image()
  img.src = `img/${meme.selectedImgId}.jpg`
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    renderText()
  }
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
  // elText.focus()
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

function onSelectImg(imgId) {
  var elModal = document.querySelector('.modal-gallery')
  elModal.style.display = 'none'
  var elContent = document.querySelector('.main-content')
  elContent.style.display = 'flex'
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
    console.log(encodedUploadedImgUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`
    )
  }
  // Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}
