import { analyticsMutations, analyticsActions } from '../types'

import Analytics from 'electron-google-analytics';
const analytics = new Analytics('UA-20842963-1');
const {app} = require('electron').remote;

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


}

const actions = {

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
