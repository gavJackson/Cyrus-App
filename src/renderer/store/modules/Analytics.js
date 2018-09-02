import { analyticsMutations, analyticsActions } from '../types'

import Analytics from 'electron-google-analytics';
const analytics = new Analytics('UA-20842963-1');
const {app} = require('electron').remote;

// import fullname from 'fullname';
import is from 'electron-is'

const state = {
	user: "",
	clientId: "",
	googleAnalyticsDown: false,
}

const mutations = {
	[analyticsMutations.GOOGLE_DOWN](state){
		state.googleAnalyticsDown = true
	},

	[analyticsMutations.SET_CLIENT_ID](state, clientId){
		state.clientId = clientId
	},

	[analyticsMutations.SET_USER_NAME](state, user){
		state.user = user
	},

}

const actions = {
	[analyticsActions.GET_FULLNAME] ({ commit, state }) {
		// fullname().then(name => {
		// 	let user = name + (is.macOS() ? " (Mac)" : " (Win)")
		// 	commit(analyticsMutations.SET_USER_NAME, user)
		// });
	},


	[analyticsActions.PAGE_VIEW] ({ commit, state }, [url, title]) {
		if(!state.googleAnalyticsDown){
			analytics.pageview(`http://www.digital-mojo.com/CYRUS-APP-${app.getVersion()}/`, url, title, state.clientId)
			.then((response) => {
				commit(analyticsMutations.SET_CLIENT_ID, response.clientID)
				return response;
			}).catch((err) => {
				commit(analyticsMutations.GOOGLE_DOWN)
				return err;
			});

		}
	},
}

export default {
	state,
	mutations,
	actions
}
