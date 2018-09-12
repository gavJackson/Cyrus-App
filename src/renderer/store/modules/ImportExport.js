import { importExportActions } from '../types'
import csv from 'fast-csv'
import electron from 'electron'
import path from 'path'
import fs from 'fs'
const shell = require('electron').shell;


const desktopPath = (electron.app || electron.remote.app).getPath('desktop');
const paths = {
	IMPORT_TEMPLATE: "SnippetsToImport.csv",
}


const state = {

}

const mutations = {
	// [analyticsMutations.GOOGLE_DOWN](state){
	// 	state.googleAnalyticsDown = true
	// },

	// [analyticsMutations.SET_CLIENT_ID](state, clientId){
	// 	state.clientId = clientId
	// },


}

const actions = {

	[importExportActions.GENERATE_TEMPLATE] ({ commit, state }) {
		const importSnippetsFilePath = path.join(desktopPath, paths.IMPORT_TEMPLATE)

		csv
			.writeToPath(importSnippetsFilePath, [
				{a: "a1", b: "b1"},
				{a: "a2", b: "b2"}
			], {headers: true})
			.on("finish", function(){
				shell.openItem(importSnippetsFilePath)
				debugger
			});
	},
}

export default {
	state,
	mutations,
	actions
}
