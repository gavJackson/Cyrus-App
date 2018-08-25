import {searchMutations} from '../types'

const state = {
	searchTerm: ''
}

const mutations = {
	[searchMutations.SET_SEARCH_TERM](state, newValue){
		// TODO make AutoComplete listen to this AND update its field (when its
		// different to what its got locally, bit hacky as really ALL of the
		// model logic from AutoComplete should be in here, certainly a
		// candidate for a refactor...

		state.searchTerm = newValue
	},
}

const getters = {
	getSearchTerm: state => state.searchTerm

}

export default {
	state,
	mutations,
	getters
}