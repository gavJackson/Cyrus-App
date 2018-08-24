import {systemMutations, tourMutations} from '../types'

const state = {
	shortcutKey: {
		pattern: 'CommandOrControl+Alt+C',
		label: {
			win: 'Ctrl+Alt+C',
			linux: 'Ctrl+Alt+C',
			osx: 'CMD+Alt+C',
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
		this.commit(tourMutations.START, null, { root: true })
	},





}

const actions = {

}

export default {
	state,
	mutations,
	actions
}
