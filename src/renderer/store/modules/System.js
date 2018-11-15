// import globalShortcut from 'electron'
import {systemMutations, systemActions,  tourMutations, snippetsMutations, categories} from '../types'
import is from 'electron-is'
import path from 'path'
import fs from "fs";
import _ from "underscore";
import log from "electron-log";
const { app, dialog } = require('electron').remote
const shell = require('electron').shell;

import SimpleCrypto from "simple-crypto-js"
import electron from "electron";

///////////////////////////////////////////////////////////
//
// helpers
//
///////////////////////////////////////////////////////////

///////////////////////////////
// file IO
///////////////////////////////

//
// function saveDataFile(simpleCrypto, data, isEncrypted=true){
// 	let dataToSave = data.filter( (item) => item.category != categories.CLIPPY)
// 	if(isEncrypted){
// 		dataToSave = simpleCrypto.encrypt(dataToSave)
// 	}
// 	dataToSave = JSON.stringify(dataToSave, null, '\t')
// 	fs.writeFileSync(path.join(userDataPath, paths.SNIPPETS, paths.DATA_FILE), dataToSave)
// }

function parseDataFile(filePath, defaults) {
	// We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
	// `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
	try {
		// debugger
		let data = fs.readFileSync(filePath)
		data = JSON.parse(data)

		return data
	} catch (error) {
		log.error(error.toString())
		debugger

		// if there was some kind of error, return the passed in defaults instead.
		return defaults;
	}
}

///////////////////////////////
// BETA prompting
///////////////////////////////

function startBetaPromptNotifications(commit, dispatch, state, rootState){
	if(state.isBETA && !state.hasShownBetaFeedbackPrompt) {

		// stage 1
		window.setTimeout(() => {
			if (!state.hasShownBetaFeedbackPrompt) {
				commit(systemMutations.SHOW_PROMPT, `We'd love to find out what you think about CYRUS.  Please complete our short survey which you can find on the 'Feedback' page of settings mode`)

				startBetaPromptStage2(commit, dispatch, state, rootState)
			}
		}, state.betaPromptDelay)
	}
}

function startBetaPromptStage2(commit, dispatch, state, rootState) {
	if (!state.hasShownBetaFeedbackPrompt) {
		window.setTimeout(() => {
			const dialogOptions = {
				type: 'info',
				buttons: ['Open Survey', 'Cancel'],
				message: `Thanks for using the CYRUS beta, we'd love to find out what you think about CYRUS.  Please complete our short survey and you will also qualify for your free copy of CYRUS.`
			}
			dialog.showMessageBox(dialogOptions, i => {
				if (i == 0) {	// ok button
					dispatch(systemActions.SHOW_BETA_SURVEY)
				}
				else if (i == 1) {	// cancel button
					// do nothing
				}
			})

		}, state.betaPromptDelay)
	}
}



///////////////////////////////////////////////////////////
//
// the store
//
///////////////////////////////////////////////////////////


const state = {

	settingsData: null,
	isBETA: app.getVersion().charAt(0) == '0',

	// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
	// app.getPath('userData') will return a string of the user's app data directory path.

	userDataPath:  (electron.app || electron.remote.app).getPath('userData'),

	paths: {
		SNIPPETS_FOLDER: "UserData/Snippets",
		SNIPPET_DATA_FILE: "My snippets.json",
		SETTINGS_FOLDER: "UserData",
		SETTINGS_DATA_FILE: "settings.json",
	},

	///////////////////////////////
	// encryption
	///////////////////////////////


	simpleCrypto : new SimpleCrypto("CYRUS-ROOLLZ-OK"),
	encrypt: false,


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

	// currentAgent: "Clippy",
	currentAgent: "Kitty",

	agents: {
		Kitty: "static/images/agents/Kitty/Kitty.png",
		Clippy: "static/images/agents/clippy/ClippyWithPaper.png",
		PooEggCrack: "static/images/agents/PooEggCrack/PooEggCrack-normal.png",
		Pikachu: "static/images/agents/Pikachu/Pikachu.gif",
	},

	///////////////////////////////
	// general settings
	///////////////////////////////

	launchCyrusAtStartup: false,
	hasShownBetaFeedbackPrompt: false,
	betaPromptDelay: 300000, // 5 mins
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


	[systemMutations.SHOW_PROMPT](state, message){
		new Notification('CYRUS', {
			body: message,
			silent: false,
		})
	},


	[systemMutations.LOAD_SETTINGS](state){
		state.settingsData = parseDataFile(path.join(state.userDataPath, state.paths.SETTINGS_FOLDER, state.paths.SETTINGS_DATA_FILE), null)

		if(state.settingsData != null){
			state.launchCyrusAtStartup = (String(state.settingsData.launchCyrusAtStartup).toLowerCase() === 'true')
			state.hasShownBetaFeedbackPrompt = (String(state.settingsData.hasShownBetaFeedbackPrompt).toLowerCase() === 'true')
		}
	},

	[systemMutations.SAVE_SETTING](state, payload){
		state[payload.key] = payload.value
		state.settingsData[payload.key] = payload.value


		fs.writeFileSync(path.join(state.userDataPath, state.paths.SETTINGS_FOLDER, state.paths.SETTINGS_DATA_FILE), JSON.stringify(state.settingsData, null, '\t'))
	},
}



const actions = {
	// called when the App is created, starts timer to notify for Beta
	[systemActions.INIT]({ commit, dispatch, state, rootState }) {

		// first load settings.json and re-populate self
		commit(systemMutations.LOAD_SETTINGS)

		startBetaPromptNotifications(commit, dispatch, state, rootState)
	},

	[systemActions.SHOW_BETA_SURVEY]({ commit, dispatch, state, rootState }){
		commit(systemMutations.SAVE_SETTING, {key: 'hasShownBetaFeedbackPrompt', value: true})

		shell.openExternal("https://www.surveymonkey.com/r/39GD22K")
	},



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
