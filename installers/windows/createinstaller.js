const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'CYRUS-app-win32-x64/'),
    authors: 'Gavin Jackson',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'CYRUS-app.exe',
    setupExe: 'CYRUSAppInstaller.exe',
    setupIcon: path.join(rootPath, 'src', 'renderer', 'assets', 'images', 'icons', 'CYRUSIcon.ico')
  })
}