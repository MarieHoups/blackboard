const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({ width: 700, height: 800,show: false});
  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
});

const getSelectedFile = exports.getSelectedFile = (targetWindow) => {
  const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
    filters: [{ name: 'PNG images', extensions: ['png'] }]
  });
  if (!files) return false;
  return files[0];
};

const insertFile = exports.insertFile = (targetWindow, filePath) => {
  const file = filePath || getSelectedFile(targetWindow);
  targetWindow.webContents.send('file-opened', file);
};
