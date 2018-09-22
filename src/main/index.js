'use strict'

import {app, BrowserWindow, default as electron, globalShortcut, Menu} from 'electron'
import MenuBar from 'menubar'



/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`



function createWindow(app) {
	// log.log('Main log');
	// log.error('Main error');

	const userDataPath = (electron.app || electron.remote.app).getPath('userData');

	var Positioner = require('electron-positioner')
	var path = require("path")
	var fs = require("fs")
	var initPath = path.join(userDataPath, "UserData/settings.json")
	var dirname = path.dirname(initPath)
	if (!fs.existsSync(dirname) || !fs.existsSync(initPath)) {
		// make UserData folder
		fs.mkdirSync(dirname)

		// write settings.json into UserData
		fs.writeFileSync(initPath, JSON.stringify({}));

		// make snippets folder
		fs.mkdirSync(path.join(dirname, "Snippets"))

	}

	var data
	let haveLoadedBounds = false
	try {
		data = JSON.parse(fs.readFileSync(initPath, 'utf8')).bounds || {}
	}
	catch (e) {
		data = {}
	}

	if (data.hasOwnProperty('x') && data.hasOwnProperty('y')) {
		haveLoadedBounds = true
	}

	data.height = 400
	data.width = 400
	data.useContentSize = true
	data.transparent = true
	data.resizable = false
	data.frame = false
	data.hasShadow = false

	mainWindow = new BrowserWindow(data);
	mainWindow.loadURL(winURL)
	mainWindow.setResizable(false)
    mainWindow.setFocusable(true)
    mainWindow.setFullScreenable(false)
	mainWindow.setMaximizable(false)

	if (!haveLoadedBounds) {
		var positioner = new Positioner(mainWindow)
		positioner.move('bottomRight')
	}

	mainWindow.on('close', () => {
		try {
			data = JSON.parse(fs.readFileSync(initPath, 'utf8'))
		}
		catch (e) {
			data = {}
		}

		data.bounds = mainWindow.getBounds()
		fs.writeFileSync(initPath, JSON.stringify(data, null, '\t'));
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

function registerShortCutsKeys() {
	// TODO figure out how to get this from the store

	// let x = System.state.shortcutKey.pattern;
	// debugger
	globalShortcut.register('CommandOrControl+Alt+C', () => {
		mainWindow.focus();

		app.emit('GLOBAL_SHORT_CUT_KEY');

	})

}

const MENU_MODE = false

if(MENU_MODE == false){

	///////////////////////////////////////////////////////////
	//
	// app mode
	//
	///////////////////////////////////////////////////////////


	app.on('ready', () => {
		createWindow(app)

		registerShortCutsKeys()
	})

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow()
		}
	})
}
else {

	///////////////////////////////////////////////////////////
	//
	// menu bar mode
	//
	///////////////////////////////////////////////////////////


	const menubar = new MenuBar({
	  height: 400,
	  width: 400,
	  minHeight: 400,
	  minWidth: 400,
	  maxHeight: 400,
	  maxWidth: 400,
	  preloadWindow: true,
	  alwaysOnTop: true,
	});
	//
	// let config = {}
	//
	// if (process.env.NODE_ENV === 'development') {
	// 	config = require('../config')
	// 	config.url = `http://localhost:${config.port}`
	// } else {
	// 	config.devtron = false
	// 	config.url = `file://${__dirname}/dist/index.html`
	// }
	//
	//
	// menubar.on('after-create-window', () => {
	// 	menubar.window.loadURL(winURL)//config.url);
	// });

	// mb.on('ready', function ready () {
	// 	console.log('app is ready')
	//
	// 	registerShortCutsKeys()
	// })

}

///////////////////////////////////////////////////////////
//
// general stuff
//
///////////////////////////////////////////////////////////


app.on('will-quit', () => {
	globalShortcut.unregisterAll()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
