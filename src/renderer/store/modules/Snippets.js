import electron from 'electron'
import path from 'path'
import fs from 'fs'
import {snippetsMutations, snippetsActions, categories, tourMutations, systemMutations} from '../types'
import _ from 'underscore'
import log from 'electron-log'


///////////////////////////////////////////////////////////
//
// helper functions
//
///////////////////////////////////////////////////////////

function saveDataFile(rootState, state){
    let dataToSave = state.data.filter( (item) => item.category != categories.CLIPPY)
    if(rootState.System.encrypt){
        dataToSave = rootState.System.simpleCrypto.encrypt(dataToSave)
    }
    dataToSave = JSON.stringify(dataToSave, null, '\t')
    fs.writeFileSync(path.join(rootState.System.userDataPath, rootState.System.paths.SNIPPETS_FOLDER, rootState.System.paths.SNIPPET_DATA_FILE), dataToSave)
}

function parseDataFile(rootState, filePath, defaults) {
	// We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
	// `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
	try {
		// debugger
		let data = fs.readFileSync(filePath)
		data = JSON.parse(data)
		if(_.isString(data)){	// only attempt to decrypt non-objects, ie strings
			// if(isEncrypted) {
				data = rootState.System.simpleCrypto.decrypt(data, true)
			// }
		}

		// validate each item making sure it has all the known properties
		let requiredProperties = ['name','category','language','tags','snippet'] //'description',

		data.forEach(item => {
			requiredProperties.forEach(prop => {
				if(item.hasOwnProperty(prop) == false){
					throw new SyntaxError(`parseDataFile.SNIPPET_MISSING_PROPERTY: Invalid snippet in JSON file '${filePath}' missing required property '${prop}'`, filePath)
				}
			})
		})

		return data
	} catch (error) {
		// TODO read from global settings file on whether to report errors in the UI
		log.error(error.toString())
		// debugger

		// if there was some kind of error, return the passed in defaults instead.
		return defaults;
	}
}

///////////////////////////////////////////////////////////
//
// the store
//
///////////////////////////////////////////////////////////

const state = {



	// pre-populated with `Clippy` specific items (which should be at the top)
	data: [
		{
			"name": "Create new snippet",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Create a new live template snippet for Clippy",
			"tags": [],
			"snippet": "CREATE_NEW_TEMPLATE"
		},
		{
			"name": "Edit snippets",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Edit or delete existing snippets for Clippy",
			"tags": [],
			"snippet": "EDIT_TEMPLATES"
		},
		{
			"name": "Import snippets",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Import live templates into Clippy from an external json file",
			"tags": [],
			"snippet": "IMPORT_TEMPLATES"
		},
		{
			"name": "Export snippets",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Export and share your live templates from Clippy.  Send to a friend",
			"tags": [],
			"snippet": "EXPORT_TEMPLATES"
		},
		{
			"name": "About CYRUS",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "About CYRUS, FAQ, Frequenly asked questions, version number and author details",
			"tags": [],
			"snippet": "ABOUT"
		},
		{
			"name": "General settings",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Launch at login",
			"tags": [],
			"snippet": "GENERAL_SETTINGS"
		},
		{
			"name": "Enter settings mode",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Create or edit snippets, import / export snippets, help, about, manage snippets, general settings",
			"tags": [],
			"snippet": "SETTINGS_MENU"
		},
		{
			"name": "Show Help",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Show tips, help me, keyboard shortcuts, how to guide, instructions, what do i do, wtf, fuck",
			"tags": [],
			"snippet": "SHOW_TIPS"
		},
		{
			"name": "Restart tour",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Start the tour again and find out how to search for and add snippets",
			"tags": [],
			"snippet": "RESTART_TOUR"
		},
		{
			"name": "Quit CYRUS",
			"category": categories.CLIPPY,
			"language": "Clippy",
			"description": "Exit CYRUS, Close the Application, Quit",
			"tags": [],
			"snippet": "CLOSE_CYRUS"
		},

	],
	hasUserGeneratedSnippets: false,
	hasAddedExamples: false,

	examples: [
		{
			"name": "The term `email`",
			"category": categories.CLIPPY,
			"language": "text",
			"description": "",
			"tags": ["example"],
			"snippet": "email"
		},
		{
			"name": "Stop sending me spam email template",
			"category": categories.CLIPPY,
			"language": "text",
			"description": "",
			"tags": ["example"],
			"snippet": "%RECIPIENT%\n\nPlease take me off your email list.  %REASON%.\n\n%SIGN_OFF%\n\nCYRUS",
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

	],
    encrypt: true,

	languages: [
		{id: "text", label: "Plain text"},
		// {id: "textWithPlaceholders", label: "Plain text (with placeholders)"},
		// {id: "c#", label: "C#"},
		{id: "css", label: "CSS"},
		{id: "html", label: "HTML"},
		{id: "javascript", label: "JavaScript"},
		{id: "javascript", label: "JSON"},
		{id: "xml", label: "XML"},
	]

}

const mutations = {
	// iterates through all json files in "UserData/Snippets" and loads them
	// as snippets

	[snippetsMutations.ADD_EXAMPLES_FOR_TOUR](state) {
		// if there are no user generated snippets, add the sample ones to get us started
		if (!state.hasAddedExamples) {
			state.data = state.data.concat(state.examples)

			state.hasAddedExamples = true
		}
	},

	[snippetsMutations.SET_HAS_USER_SNIPPETS_FLAG](state, newValue) {
		state.hasAddedExamples = newValue
	},

	[snippetsMutations.SET_SNIPPET_DATA](state, newValue) {
		state.data = newValue
	},
}


const actions = {

	[snippetsActions.LOAD]({ commit, state, rootState }) {

		// MAC: /Users/GJackson/Library/Application Support/CYRUS/UserData/Snippets
		// WIN: C:\Users\gavinjackson\AppData\Roaming\CYRUS\UserData\Snippets
		let startingLength = state.data.length
		let data = state.data

		// ------ useful for tour debugging --------
		// ------ reinstate this when finished with working on the Tour
		//
		let files =  fs.readdirSync(path.join(rootState.System.userDataPath, rootState.System.paths.SNIPPETS_FOLDER))
		files = files.filter( (item) => item.indexOf('.json') != -1)

		for(let i=0; i < files.length; i++){

			let filePath = path.join(rootState.System.userDataPath, rootState.System.paths.SNIPPETS_FOLDER, files[i])

			data = data.concat(parseDataFile(rootState, filePath, []))
		}
		// ------ useful for tour debugging --------

		let hasUserGeneratedSnippets = startingLength != data.length

		// debugger
		// if there are no user generated snippets, add the sample ones to get us started
		if(!hasUserGeneratedSnippets){
			data = data.concat(state.examples)

			commit(tourMutations.START, null, { root: true })
		}

		// strip out any duplicates that might have snuck in (based on snippet names only)
		data = _.uniq(data, false, 'name')

		// add an Id into each item
		data.forEach(function(item, index){
			item.id = index;
		});

		// update store
		commit(snippetsMutations.SET_HAS_USER_SNIPPETS_FLAG, hasUserGeneratedSnippets, { root: true })
		commit(snippetsMutations.SET_SNIPPET_DATA, data, { root: true })

	},


	[snippetsActions.SAVE_ITEM]({ commit, state, rootState }, editedItem) {
		// For ADD: insert item into array
		let data = state.data
		if(editedItem.id == null){
			// adds the `id` property to the start, makes for easier to read JSON
			editedItem = {id: state.data.length, ...editedItem}
			data.push(editedItem)
		}
		// For EDIT: update the internal JS array
		else{
			data = data.map((item) => {
				if(item.id == editedItem.id){
					item = editedItem
				}

				return item
			})
		}

        // now save the effected json file (ie based on the category)
        saveDataFile(rootState, state)
		commit(snippetsMutations.SET_SNIPPET_DATA, data, { root: true })

	},


	[snippetsActions.DELETE_ITEM]({ commit, state, rootState }, editedItem) {
		//remove from data
		let data = state.data
		data = data.filter( (item) => item.id != editedItem.id)

		// now save the effected json file (ie based on the category)
		saveDataFile(rootState, state)
		commit(snippetsMutations.SET_SNIPPET_DATA, data, { root: true })

	},

	[snippetsMutations.TOGGLE_ENCRYPTION](state, newValue, rootState) {
		if(state.encrypt !== newValue){
            state.encrypt = newValue

            // now just save the data file to reflect the new setting
			saveDataFile(rootState, state)
		}
    },
}


const getters = {
	applyFilter: (state) => (searchTerm) => {
		let originalSearchTerm = searchTerm
		let startsWithCapticalLetters = /([A-Z]{1,}\s?)/g
		let colonRegExp = /(\w+:)/g
		let startOrEndSpacesRegExp = /^(\s+)|(\s+)$/g
		let twoOrMoreSpacesRegExp = /\s{2,}/g

		let i
		let filteredData = []


		// debugger
		// [x] Capital letters identify start of words (or other capitals) - immediate filter
		if(startsWithCapticalLetters.test(searchTerm)){
			// get an array of letters
			searchTerm = searchTerm.replace(/\s/g, '')
			let capitalLetters = searchTerm.match(startsWithCapticalLetters)[0].split("")

			let lettersPattern = "(^|\\s)"
			for(i=0; i < capitalLetters.length; i++) {
				let letter = capitalLetters[i]

				if (i != capitalLetters.length - 1) {
					lettersPattern += `${letter}.*?\\s`
				}
				else {
					lettersPattern += `${letter}.*?$`
				}
			}

			lettersPattern = `(${lettersPattern})`

			let lettersRegExp = new RegExp(lettersPattern, "i")

			filteredData = state.data.filter(snippet => {
				return lettersRegExp.test(snippet.name)
			});

			// debugger

			searchTerm = searchTerm.replace(capitalLetters.join(""), "")
		}
		else{

			filteredData = state.data.slice()

		}

		// [x] Colons, e.g `Word:` identify categories / tags / languages - immediate filter
		if(colonRegExp.test(searchTerm)){
			let colons = searchTerm.match(colonRegExp)
			for(i=0; i < colons.length; i++){
				let colon = colons[i].replace(':','').toLowerCase()


				filteredData = filteredData.filter(snippet => {
					return (snippet.category || "").toLowerCase().indexOf(colon.toLowerCase()) != -1 ||
						(snippet.language || "").toLowerCase().indexOf(colon.toLowerCase()) != -1 ||
						(snippet.tags).indexOf(colon.toLowerCase()) != -1
				});
			}


			searchTerm = searchTerm.replace(colonRegExp, "")
		}

		searchTerm = searchTerm.replace(startOrEndSpacesRegExp, "")
		searchTerm = searchTerm.replace(twoOrMoreSpacesRegExp, " ")

		if(searchTerm != "") {
			// [x] lower case becomes index Of
			filteredData = filteredData.filter(snippet => {
				return (snippet.name || "").toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
					(snippet.category || "").toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 ||
					(snippet.language || "").toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 ||
					(snippet.tags).indexOf(searchTerm.toLowerCase()) != -1 ||
					(snippet.description || "").toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 ||

					(snippet.name || "").toLowerCase().indexOf(originalSearchTerm.toLowerCase()) > -1 ||
					(snippet.category || "").toLowerCase().indexOf(originalSearchTerm.toLowerCase()) != -1 ||
					(snippet.language || "").toLowerCase().indexOf(originalSearchTerm.toLowerCase()) != -1 ||
					(snippet.tags).indexOf(originalSearchTerm.toLowerCase()) != -1 ||
					(snippet.description || "").toLowerCase().indexOf(originalSearchTerm.toLowerCase()) != -1
			});
		}

		return filteredData;
	},

	getItemById: (state) => (id) => {
		let found = state.data.filter(item => item.id == id)

		if(found.length == 1){
			return found[0]
		}
	},

	getCategories: (state) => () => {
		return _.uniq(_.pluck(state.data, 'category'))
	},

	getTags: (state) => () => {
		let tags = []
		let rankedTags = {}

		tags = _.uniq(_.pluck(state.data, 'tags'))
		tags = _.flatten(tags)
		tags.forEach( (tag) => {
			if(rankedTags.hasOwnProperty(tag)){
				rankedTags[tag] = rankedTags[tag] + 1

			}
			else{
				rankedTags[tag] = 1
			}
		})

		tags = []
		for (const key of Object.keys(rankedTags)) {
			tags.push({
				tag: key,
				count: rankedTags[key]
			})
		}




		return _.sortBy(tags, "count").reverse()
	},

	getNames: (state) => (idToExclude = -1) => {
		let filteredData = _.filter(state.data, (item) => {
			if(item == null || item.name == null){
				return false
			}
			else {
				return item.id != idToExclude
			}
		})

		let names = _.uniq(_.pluck(filteredData, 'name'))

		names = _.map(names, (name) => { return name.toLowerCase() })


		return names
	},

}

export default {
	state,
	mutations,
	actions,
	getters
}
