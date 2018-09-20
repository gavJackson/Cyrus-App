// import globalShortcut from 'electron'
import {systemMutations, tourMutations, snippetsMutations, categories} from '../types'
import is from 'electron-is'
import path from 'path'
import fs from "fs";
import _ from "underscore";
import log from "electron-log";
const { app } = require('electron').remote
import SimpleCrypto from "simple-crypto-js"
import electron from "electron";

///////////////////////////////////////////////////////////
//
// helpers
//
///////////////////////////////////////////////////////////

function saveDataFile(simpleCrypto, data, isEncrypted=true){
	let dataToSave = data.filter( (item) => item.category != categories.CLIPPY)
	if(isEncrypted){
		dataToSave = simpleCrypto.encrypt(dataToSave)
	}
	dataToSave = JSON.stringify(dataToSave, null, '\t')
	fs.writeFileSync(path.join(userDataPath, paths.SNIPPETS, paths.DATA_FILE), dataToSave)
}

function parseDataFile(simpleCrypto, filePath, defaults) {
	// We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
	// `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
	try {
		// debugger
		let data = fs.readFileSync(filePath)
		data = JSON.parse(data)
		if(_.isString(data)){	// only attempt to decrypt non-objects, ie strings
			// if(isEncrypted) {
			data = simpleCrypto.decrypt(data, true)
			// }
		}

		// validate each item making sure it has all the known properties
		let requiredProperties = ['name','category','language','tags','snippet'] //'description',

		data.forEach(item => {
			requiredProperties.forEach(prop => {
				if(item.hasOwnProperty(prop) == false){
					throw new SyntaxError(`parseDataFile.SNIPPET_MISSING_PROPERTY: Invalid snippet in JSON file '${filePath}' missing required property '${prop}'`, filePath)
				}
			})
		})

		return data
	} catch (error) {
		log.error(error.toString())
		// debugger

		// if there was some kind of error, return the passed in defaults instead.
		return defaults;
	}
}


///////////////////////////////////////////////////////////
//
// the store
//
///////////////////////////////////////////////////////////


const state = {
	// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
	// app.getPath('userData') will return a string of the user's app data directory path.

	userDataPath:  (electron.app || electron.remote.app).getPath('userData'),

	paths: {
		SNIPPETS_FOLDER: "UserData/Snippets",
		SNIPPET_DATA_FILE: "My snippets.json"
	},

	///////////////////////////////
	// encryption
	///////////////////////////////


	simpleCrypto : new SimpleCrypto("CYRUS-ROOLLZ-OK"),
	encrypt: true,


	///////////////////////////////
	// shortcuts
	///////////////////////////////


	shortcutKey: {
		pattern: 'CommandOrControl+Alt+C',
		label: {
			win: 'Ctrl+Alt+C',
			linux: 'Ctrl+Alt+C',
			osx: 'CMD ⌘+Alt+C',
		}
	},

	///////////////////////////////
	// agent
	///////////////////////////////

	currentAgent: "Clippy",

	agents: {
		Clippy: "static/images/agents/clippy/ClippyWithPaper.png",
		PooEggCrack: "static/images/agents/PooEggCrack/PooEggCrack-normal.png",
		Pikachu: "static/images/agents/Pikachu/Pikachu.gif",
	},

	///////////////////////////////
	// general settings
	///////////////////////////////

	launchCyrusAtStartup: false,
	notifications: {
		betaFeedbackRequested: false
	}
}

const mutations = {

	///////////////////////////////
	// short cuts
	///////////////////////////////

	[systemMutations.CREATE_NEW_TEMPLATE]() {
		window.location.hash = '/settings/create'
	},

	[systemMutations.SHOW_TIPS]() {
		window.location.hash = '/settings/help'
	},

	[systemMutations.EDIT_TEMPLATES]() {
		window.location.hash = '/settings/templates'
	},

	[systemMutations.IMPORT_TEMPLATES]() {
		window.location.hash = '/settings/import'
	},

	[systemMutations.EXPORT_TEMPLATES]() {
		window.location.hash = '/settings/export'
	},

	[systemMutations.GENERAL_SETTINGS]() {
		window.location.hash = '/settings/general'
	},

	[systemMutations.SETTINGS_MENU]() {
		window.location.hash = '/settings/menu'
	},

	[systemMutations.ABOUT]() {
		window.location.hash = '/settings/about'
	},

	[systemMutations.RESTART_TOUR]() {
		this.commit(snippetsMutations.ADD_EXAMPLES_FOR_TOUR, null, {root: true})
		this.commit(tourMutations.START, null, {root: true})
	},

	[systemMutations.CLOSE_CYRUS]() {
		const remote = require('electron').remote
		remote.getCurrentWindow().close()

		// globalShortcut.unregisterAll()
		// const app = require('electron').app
		remote.exit()
	},

	///////////////////////////////
	// settings
	///////////////////////////////


	[systemMutations.SETTING_CHANGE_LAUNCH_AT_START_UP](state, newValue = null) {
		if (newValue != null) {
			state.launchCyrusAtStartup = newValue
		}

		// Actually add to login items
		const appFolder = path.dirname(process.execPath)
		const updateExe = path.resolve(appFolder, '..', 'Update.exe')
		const exeName = path.basename(process.execPath)

		app.setLoginItemSettings({
			openAtLogin: state.launchCyrusAtStartup,
			path: updateExe,
			args: [
				'--processStart', `"${exeName}"`,
				'--process-start-args', `"--hidden"`
			]
		})
	},


	// called when the App is created, starts timer to notify for Beta
	[systemMutations.APP_CREATED](state) {

		// first load settings.json and re-populate self


	},
}

const actions = {

}

const getters = {
	getShortcutKeys: (state) => () => {
		if(is.macOS()){
			return state.shortcutKey.label.osx
		}
		else{
			return state.shortcutKey.label.win
		}
	},

	getAgentImage: (state) => () => {
		return state.agents[state.currentAgent]
	},
}

export default {
	state,
	mutations,
	getters,
	actions
}
