import {systemMutations, tourMutations, snippetsMutations} from '../types'
import is from 'electron-is'
// import globalShortcut from 'electron'
import path from 'path'
const {app} = require('electron').remote


const state = {
	shortcutKey: {
		pattern: 'CommandOrControl+Alt+C',
		label: {
			win: 'Ctrl+Alt+C',
			linux: 'Ctrl+Alt+C',
			osx: 'CMD ⌘+Alt+C',
		}
	},

	currentAgent: "Clippy",

	agents: {
		Clippy: "static/images/agents/clippy/ClippyWithPaper.png",
		PooEggCrack: "static/images/agents/PooEggCrack/PooEggCrack-normal.png",
		Pikachu: "static/images/agents/Pikachu/Pikachu.gif",
	},

	launchCyrusAtStartup: false,
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
		this.commit(snippetsMutations.ADD_EXAMPLES_FOR_TOUR, null, { root: true })
		this.commit(tourMutations.START, null, { root: true })
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
		if(newValue != null){
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
	}
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
