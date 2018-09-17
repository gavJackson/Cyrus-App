import {categories, importExportActions, snippetsMutations, tourMutations} from '../types'
import csv from 'fast-csv'
import electron from 'electron'
import path from 'path'
import fs from 'fs'
const shell = require('electron').shell;
const {dialog } = require('electron').remote
import _ from 'underscore'

///////////////////////////////////////////////////////////
//
// helpers
//
///////////////////////////////////////////////////////////

const desktopPath = (electron.app || electron.remote.app).getPath('desktop');
const paths = {
	IMPORT_TEMPLATE: "SnippetsToImport.csv",
}

function flattenForCSV(input){
	let output = []
	let hasVariables = false

	input.forEach( (item, index) => {
		let data = {
			name: item.name,
			// category: item.category,
			language: item.language,
			description: item.description,
			tags: item.tags.join(","),
			snippet: item.snippet,
			variables: ""
		}

		if(item.variables){
			data.variables = JSON.stringify(item.variables, null, '  ')
			hasVariables = true
		}

		output.push(data)
	} )

	// if(hasVariables){
	// 	output.forEach( (item, index) => {
	// 		if(!item.variables){
	// 			item.variables = ""
	// 		}
	// 	})
	// }

	return output
}

///////////////////////////////////////////////////////////
//
// store...
//
///////////////////////////////////////////////////////////


const state = {
	importTemplate: [
		{
			"name": "My email address",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "personal email",
			"tags": ["personal", "email"],
			"snippet": "<ENTER_HERE>"
		},
		{
			"name": "My work email address",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "",
			"tags": ["work", "email"],
			"snippet": "<ENTER_HERE>"
		},
		{
			"name": "My phone number",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "personal phone",
			"tags": ["personal", "phone"],
			"snippet": "<ENTER_HERE>"
		},
		{
			"name": "My work phone number",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "",
			"tags": ["work", "phone"],
			"snippet": "<ENTER_HERE>"
		},
		{
			"name": "My home address",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "",
			"tags": ["personal", "address"],
			"snippet": "<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>"
		},
		{
			"name": "My work address",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "",
			"tags": ["work", "address"],
			"snippet": "<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>\n<ENTER_HERE>"
		},
		{
			"name": "Stop sending me spam email template",
			"category": categories.USER_GENERATED,
			"language": "text",
			"description": "",
			"tags": ["email"],
			"snippet": "%RECIPIENT%\n\nPlease take me off your email list.  %REASON%.\n\n%SIGN_OFF%\n\n<YOUR_NAME>",
			"variables": {
				"RECIPIENT": [
					"Dear Sir/Madam",
					"To Whom it may concern",
					"To unwelcome marketer"
				],
				"REASON": [
					"I do not remember signing up",
					"You are sending me too many emails",
					"I am no longer interested in your product"
				],
				"SIGN_OFF": [
					"Your sincerely",
					"Regards",
					"Faithfully"
				]
			}
		},
	]
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
			.writeToPath(importSnippetsFilePath,
				flattenForCSV(state.importTemplate),
				{
					headers: true,
					includeEndRowDelimiter: true
				}
			).on("finish", function(){
				const dialogOptions = {type: 'info', buttons: ['Open now', 'Cancel'], message: 'CSV Template has been generated and added to your desktop.  Feel free to add more snippets (rows) or just fill in our suggestions.\n\nOnce you have filled in the template, you can import it back into CYRUS.'}
				dialog.showMessageBox(dialogOptions, i => {
					if(i == 0){	// ok button
						shell.openItem(importSnippetsFilePath)
					}
					else if(i == 1){	// cancel button
						// do nothing
					}
				})
			});
	},


	[importExportActions.IMPORT_CSV] ({ commit, state, rootState }) {
		const dialogOptions = {
			title: 'Import snippets CSV ',
			defaultPath: desktopPath,
			buttonLabel: 'Import',
			filters: [{
				name: 'Snippet CSVs',
				extensions: ['csv']
			}],
		}

		let languages = _.pluck(rootState.Snippets.languages, 'id')

		var self = this
		dialog.showOpenDialog(dialogOptions, files => {
			if(files !== undefined){
				// only process the first file as not allowing multiple import
				// let csvFile = files[0]
				var stream = fs.createReadStream(files[0]);
				var importedSnippets = []
				let expectedHeaders = ["name", "language", "description", "tags", "snippet", "variables"]
				let requiredHeaders = ["name", "snippet"]

				csv
					.fromStream(stream, {headers : expectedHeaders})
					.validate(function(data){
						let isValid = true
						let header
						// make sure the required headers have values (and that they are not the same words as the
						// headers (ie the header row)
						for(let i in requiredHeaders){
							header = requiredHeaders[i]

							if(data[header] == "" || data[header] == header){
								isValid = false
								break
							}

						}

						// make sure language is one of the proper ones, if not default it to `text`
						if(isValid && languages.indexOf(data.language) == -1){
							debugger
							data.language = 'text'
						}



						return isValid

					})
					.on("data-invalid", function(data){
						//do something with invalid row
						debugger
					})
					.on("data", function(data){
						let includeSnippet = true
						if(data.variables != ""){
							try {
								data.variables = JSON.parse(data.variables)
							}
							catch(err){
								debugger
								includeSnippet = false
							}
						}


						data.category = categories.IMPORTED
						data.tags = data.tags.split(",")

						if(includeSnippet){
							importedSnippets.push(data)
						}

					})
					.on("end", function(){
						for(let index in importedSnippets){
							let snippet = importedSnippets[index]
							self.commit(snippetsMutations.SAVE_ITEM, snippet, { root: true })
						}
					});
			}
		})


	},
}

export default {
	state,
	mutations,
	actions
}
