<template src="./TemplateForm.html"></template>

<script>
	import { snippetsMutations} from './../../store/types'
	import editor from 'vue2-ace-editor'
	import InputTag from 'vue-input-tag'
	const {dialog } = require('electron').remote

	export default {
		name: "CreateTemplate",

		components: {
			editor: editor,
			'input-tag': InputTag
		},

		data (){
			return {
				currentState: null,
				itemBeingEdited: null,
				currentTab: "SNIPPET",
				currentItemHasPlaceholders: false,
				validationMessage: "",
				invalidFields: [],
				formIsDirty: false,
				deleteTimer: null,
				deleteTimerId: null,
				deleteButtonLabel: "Delete",
				editor: null,
				tagAddKeys: [13,188,9],	//ENTER, COMMA, TAB

				item: {
					id: null,
					name: null,
					category: null,
					description: null,
					tags: [],
					language: null,
					snippet: "",
					variables: null,
				}
			}
		},

		watch: {
			// currentTab: function(newValue) {
			// 	if(newValue == 'PLACEHOLDER'){
			// 		let that = this
			// 		setTimeout( () => {
			// 			that.$refs.inputField0[0].focus()
			// 		}, 1)
			// 	}
			// },

			'item.language': function(newValue){
				this.editor.setOption('wrap', (newValue == 'text' || newValue == 'textWithPlaceholders'))
			},

			'item.snippet': function (newValue) {
				if(newValue == null){
					return
				}

				// find all placeholders
				let variables = []
				let matches = newValue.match(/%(\w*?)%/g)

				if (matches != null) {
					this.currentItemHasPlaceholders = true

					matches.forEach((item) => {
						let key = item.replace(/%/g, '')
						variables.push({
							key: key,
							value: this.item.variables ? this.item.variables[key] || [] : []
						})
					})
				}
				else {
					this.currentItemHasPlaceholders = false
				}

				// sync up the variables object
				this.item.variables = {}
				variables.forEach((item) => {
					this.item.variables[item.key] = item.value
				})
			},

			deleteTimer: function(newValue){
				if(newValue == null){
					this.deleteButtonLabel = "Delete"
				}
				else if(newValue <= 5 && newValue >= 1 ){
					this.deleteButtonLabel = `Are you sure? ${newValue}`
				}
			}
		},

		computed: {
			isValid(){
				this.invalidFields = []
				if(this.item == null)
					return false

				let isValid = true
				let reason = ""

				// first validate the name
				if(!this.item.name){
					this.invalidFields.push('inputName')
					isValid = false

					reason = "Name is required"
				}
				else if(this.$store.getters.getNames(this.item.id).indexOf(this.item.name.toLowerCase()) != -1) {
					this.invalidFields.push('inputName')

					isValid = false
					reason = `You already have a snippet called ${this.item.name}`
				}

				// now make sure there is a snippet
				if(!this.item.snippet){
					this.invalidFields.push('inputSnippet')

					if(isValid){
						isValid = false

						reason = "Snippet is required"
					}
				}

				this.validationMessage = reason

				return isValid
			},

			saveButtonLabel(){
				return this.currentState == 'ADD' ? 'Add' : 'Save'
			},

			cancelButtonRouteName(){
				return this.currentState == 'ADD' ? 'menu' : 'templates'
			},

			categories() {
				return this.$store.getters.getCategories()
			},

			languages() {
				return [
					{id: "text", label: "Plain text"},
					// {id: "textWithPlaceholders", label: "Plain text (with placeholders)"},
					// {id: "c#", label: "C#"},
					{id: "css", label: "CSS"},
					{id: "html", label: "HTML"},
					{id: "javascript", label: "JavaScript"},
					{id: "javascript", label: "JSON"},
					{id: "xml", label: "XML"},
				]
			},

			isTourRunning() {
				return this.$store.state.Tour.isTourRunning
			},

		},

		// loads an item to be edited
		created(){
			this.itemBeingEdited = null;
			if(this.$route.params.id){
				this.itemBeingEdited = this.$store.getters.getItemById(this.$route.params.id)
				if(this.itemBeingEdited != null){
					this.currentState = 'EDIT'

					this.item.id = this.itemBeingEdited.id
					this.item.name = this.itemBeingEdited.name || ""
					this.item.category = this.itemBeingEdited.category || ""
					this.item.description = this.itemBeingEdited.description || ""
					this.item.language = this.itemBeingEdited.language || "text"
					this.item.tags = this.itemBeingEdited.tags || []
					this.item.snippet = this.itemBeingEdited.snippet || ""
					this.item.variables = this.itemBeingEdited.variables || null

				}
			}

			if(this.itemBeingEdited == null){
				this.currentState = 'ADD'
				this.item.id = null
				this.item.name = null
				this.item.category = "USER_GENERATED"
				this.item.description = null
				this.item.language = "text"
				this.item.tags = []
				this.item.snippet = ""
				this.item.variables = null
			}
			this.formIsDirty = false
			this.currentTab = "SNIPPET"

			let that = this
			setTimeout(() => {
				if(!this.isTourRunning){
					that.$refs.inputName.focus()
				}
			}, 1)
		},

		methods: {
			onDeleteClicked: function() {
				window.clearInterval(this.deleteTimerId)

				if(this.deleteTimer == null){
					this.deleteTimer = 5

					this.deleteTimerId = window.setInterval( () => {
						this.deleteTimer--

						if(this.deleteTimer == 0){
							this.deleteTimer = null

							window.clearInterval(this.deleteTimerId)
						}
					}, 1000 )
				}
				else{
					this.deleteTimer = null
					this.deleteItem()

				}
			},

			editorInit: function () {
				require('brace/ext/language_tools') // language extension prerequsite...
				require('brace/mode/html')
				require('brace/mode/javascript')    //language
				require('brace/mode/less')
				require('brace/theme/monokai')
				require('brace/snippets/text') 			//snippets
				require('brace/snippets/csharp')
				require('brace/snippets/css')
				require('brace/snippets/html')
				require('brace/snippets/javascript')
				require('brace/mode/xml')

				// require('./languages/textWithPlaceholders')

				this.editor = window.ace.edit('aceEditor');
				// window.editor = this.editor
				// TODO figure out how to syntax highlight %placeholders%
			},

			resetForm(){
				if(this.itemBeingEdited != null){
					this.currentState = 'EDIT'

					this.item.id = this.itemBeingEdited.id
					this.item.name = this.itemBeingEdited.name
					this.item.category = this.itemBeingEdited.category
					this.item.description = this.itemBeingEdited.description
					this.item.language = this.itemBeingEdited.language
					this.item.tags = this.itemBeingEdited.tags
					this.item.snippet = this.itemBeingEdited.snippet
					this.item.variables = this.itemBeingEdited.variables
				}
			},

			saveForm(){
				this.formIsDirty = true

				if(this.isValid){
					this.$store.commit(snippetsMutations.SAVE_ITEM, this.item)

					this.$router.push({name: 'menuWithMessage', params: { message: this.currentState == 'ADD' ? 'Template added' : 'Template updated' }})
				}
			},

			deleteItem(){

				this.$store.commit(snippetsMutations.DELETE_ITEM, this.item)

				// this.$router.push({name: 'menuWithMessage', params: { message: this.currentState == 'ADD' ? 'Template added' : 'Template updated' }})
				this.$router.push({name: 'menuWithMessage', params: { message:'Template deleted' }})
			},

			setCurrentTab(tab){
				this.currentTab = tab;
			},

			showHelp(message){
				const dialogOptions = {type: 'info', buttons: ['OK'], message: message}

				dialog.showMessageBox(dialogOptions, i => {
					if(i == 0){	// ok button
						// do nothing
					}
				})
			},
		}
	}
</script>

<style lang="less" src="./TemplateForm.less" scoped></style>