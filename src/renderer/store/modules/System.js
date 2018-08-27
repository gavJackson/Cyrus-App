import {systemMutations, tourMutations, snippetsMutations} from '../types'
import is from 'electron-is'

const state = {
	shortcutKey: {
		pattern: 'CommandOrControl+Alt+C',
		label: {
			win: 'Ctrl+Alt+C',
			linux: 'Ctrl+Alt+C',
			osx: 'CMD ⌘+Alt+C',
		}
	},
}

const mutations = {

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
		let w = remote.getCurrentWindow()
		w.close()
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
}

export default {
	state,
	mutations,
	getters,
	actions
}
