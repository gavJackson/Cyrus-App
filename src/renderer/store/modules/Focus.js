import { focusMutations } from '../types'

const state = {
	appHasFocus: false,
	clippyHasFocus: false,
	speechBubbleHasFocus: false
}

const mutations = {

	[focusMutations.APP_FOCUS](state) {
		state.appHasFocus = true
	},

	[focusMutations.APP_BLUR](state) {
		state.appHasFocus = false
	},
}

const actions = {
	someAsyncTask({commit}) {
		// do something async
		commit('INCREMENT_MAIN_COUNTER')
	}
}

export default {
	state,
	mutations,
	actions
}
