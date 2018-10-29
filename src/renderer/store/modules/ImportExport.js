import {categories, importExportActions, snippetsMutations, tourMutations} from '../types'
import csv from 'fast-csv'
import electron from 'electron'
import path from 'path'
import fs from 'fs'
const shell = require('electron').shell;
const {dialog } = require('electron').remote
import _ from 'underscore'
import log from 'electron-log'

///////////////////////////////////////////////////////////
//
// helpers
//
///////////////////////////////////////////////////////////

const desktopPath = (electron.app || electron.remote.app).getPath('desktop');
const paths = {
	IMPORT_TEMPLATE: "TemplatesToImport.csv",
	EXPORT_TEMPLATE: "ExportedTemplates.csv",
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
				const dialogOptions = {type: 'info', buttons: ['Open now', 'Cancel'], message: 'A CSV Template has been generated and added to your desktop.  Feel free to add more snippets (rows) or just fill in our suggestions.\n\nOnce you have filled in the template, you can import it (Step 2) back into CYRUS.'}
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


	// shows a save dialog, then generates as CSV and save it in that location
	[importExportActions.EXPORT_CSV] ({ commit, state, rootState }) {
		const dialogOptions = {
			title: 'Export templates',
			buttonLabel: 'Export',
			message: 'Export selected templates as a CSV file',
			nameFieldLabel: 'CSV file',
			defaultPath: path.join(desktopPath, paths.EXPORT_TEMPLATE),
		}

		dialog.showSaveDialog(dialogOptions, filename => {
			// user presses export we get a filename
			if(filename){
				let templatesToExport = _.filter(rootState.Snippets.data, (item) => {
					return item.isSelected
				})

				csv
					.writeToPath(filename,
						flattenForCSV(templatesToExport),
						{
							headers: true,
							includeEndRowDelimiter: true
						}
					).on("finish", function(){
					const dialogOptions = {type: 'info', buttons: ['Open now', 'Cancel'], message: 'A CSV of your selected templates has been generated, you can share this with other CYRUS users or use this to bulk add/edit your own templates. Would you like to look at it now?'}
					dialog.showMessageBox(dialogOptions, i => {
						if(i == 0){	// ok button
							shell.openItem(filename)
						}
						else if(i == 1){	// cancel button
							// do nothing
						}
					})
				});

				debugger

			// TODO de-select all selected items..
			}

		})

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
				let failureCounters = {
					numRows: 0,
					invalid: 0,
					duplicate: 0,
					parseFail: 0,
				}

				csv
					.fromStream(stream, {headers : expectedHeaders})
					.validate(function(data){
						failureCounters.numRows++
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
							log.info(`importExport.INVALID_LANGUAGE: Incoming row has unrecognised language "${data.language}", defaulting to 'text'. Original data: "${JSON.stringify(data)}"`)

							data.language = 'text'
						}

						return isValid

					})
					.on("data-invalid", function(data){
						//do something with invalid row
						log.error(`importExport.IMPORT_INVALID_ROW: Did not import invalid row: "${JSON.stringify(data)}"`)
						failureCounters.invalid++
					})
					.on("data", function(data){
						let includeSnippet = true

						// make sure the variables is a valid JSON string
						if(data.variables != ""){
							try {
								data.variables = JSON.parse(data.variables)
							}
							catch(err){
								log.error(`importExport.IMPORT_VARIABLES_PARSE_ERROR: Error parsing "${data.variables}": ${err.toString()}`)
								failureCounters.parseFail++

								includeSnippet = false
							}
						}

						// also make sure the snippet doesn't already exist
						if(includeSnippet && self.getters.getNames().indexOf(data.name.toLowerCase()) != -1){
							log.error(`importExport.IMPORT_DUPLICATE: Not importing "${data.name}" as a snippet with this name already exists`)
							failureCounters.duplicate++

							includeSnippet = false
						}


						// set up some defaults / process the data
						data.category = categories.IMPORTED
						data.tags = data.tags.split(",")

						// if all good, add to array
						if(includeSnippet){
							importedSnippets.push(data)
						}

					})
					.on("end", function(){
						if(importedSnippets.length == 0){
							// error state as nothing imported
							let message = `Did not import any snippets from the ${failureCounters.numRows} rows found in the CSV because:\n`

							if(failureCounters.duplicate > 0){
								message += `\n ${failureCounters.duplicate} row(s) already existed as snippets.`
							}

							if(failureCounters.invalid > 0){
								message += `\n ${failureCounters.invalid} row(s) were not recognised as snippets.`
							}

							if(failureCounters.parseFail > 0){
								message += `\n ${failureCounters.parseFail} row(s) had an invalid variables column.`
							}
							const dialogOptions = {type: 'error', buttons: ['OK'], message: message}

							dialog.showMessageBox(dialogOptions, i => {
								if(i == 0){	// ok button
									// do nothing
								}
							})
						}
						else{
							// something to import!
							for(let index in importedSnippets){
								let snippet = importedSnippets[index]
								self.commit(snippetsMutations.SAVE_ITEM, snippet, { root: true })
							}
							window.location.hash = `/settings/menu/${importedSnippets.length} snippet(s) imported`
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
