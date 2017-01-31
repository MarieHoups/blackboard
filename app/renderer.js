const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const newFileBtn = document.getElementById('newFileBtn');
const insertFileBtn = document.getElementById('insertFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const colors = document.querySelectorAll('.colors button');
const ranges = document.querySelectorAll('input');
const clearBtn = document.getElementById('clear');

var color = ctx.strokeStyle = 'purple';
var size = ctx.lineWidth = 10;
var x = 0;
var y = 0;
var isDrawing = false;

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function draw(e) {
  if(!isDrawing) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [x, y] = [e.offsetX, e.offsetY]
}

function changeColor(e) {

  color = e.target.getAttribute('data-color') || color;
  ctx.strokeStyle = color;
  canvas.style.cursor = setCursor();
}

function changeSize(e) {
  size = e.target.value;
  ctx.lineWidth = size;
  canvas.style.cursor = setCursor();
}

function setColorBtn(btn) {
  btn.style.backgroundColor = btn.getAttribute('data-color');
}

function setCursor() {
  return `url('data:image/svg+xml;utf8,<svg  height="${size*2}" viewBox="0 0 ${size} ${size}" width="${size}" xmlns="http://www.w3.org/2000/svg"><circle cy="${size/2}" cx="${size/2}" r="${size/2}" fill="${color}"/></svg>') ${size} ${size}, auto`;
}

ipcRenderer.on('file-opened', (e, file) => {
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.src = file;
});

colors.forEach(c => setColorBtn(c));
colors.forEach(c => addEventListener('click', changeColor));
ranges.forEach(r => addEventListener('change', changeSize));

newFileBtn.addEventListener('click', () => mainProcess.createWindow());
insertFileBtn.addEventListener('click', () => mainProcess.insertFile(currentWindow));
clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, width, height));

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true; [x, y] = [e.offsetX, e.offsetY]; });
canvas.addEventListener('mouseup', (e) => isDrawing = false);
canvas.addEventListener('mouseout', (e) => isDrawing = false);
