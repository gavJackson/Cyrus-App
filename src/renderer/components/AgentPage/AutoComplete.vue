<!-- /////////////////////////////////////////////////////////////////

html template

///////////////////////////////////////////////////////////////// -->

<template src="./AutoComplete.html"></template>

<!-- /////////////////////////////////////////////////////////////////

JavaScript

///////////////////////////////////////////////////////////////// -->

<script>
	import Vue from 'vue'

	const { clipboard } = require('electron')
	const {dialog } = require('electron').remote

	import {
		focusMutations,
		searchMutations,
		tourMutations
	} from '../../store/types'
	import _ from 'underscore'


	const ROW_HEIGHT = 30;

	const placeholdersRegExp = /%[A-Z_0-9]{1,}%/gim

	const focus = {
		inserted(el) {
			el.focus()
		},
		update: function (el, binding) {
			var value = binding.value;
			if (value) {
				Vue.nextTick(function () {
					el.focus();
				});
			}
		}
	}

	export default {
		name: "AutoComplete",

		///////////////////////////////////////////////////////////
		//
		// filters
		//
		///////////////////////////////////////////////////////////


		filters: {
			highlightSearchTerm: function (word, searchTerm) {
				if(searchTerm != ""){
					// set up replacement patterns, we use placeholders during
					// the search to ensure that we dont accidently replace a
					// replacement giving us malformed HTML
					let replacements = {
						CAPITAL_START: {
							placeholder: '@£',	// needs to be reg-exp friendly too
							real: '<span class="highlight capital-letter">'
						},

						CAPITAL_END: {
							placeholder: '£@',
							real: '</span>'
						},

						TERM_START: {
							placeholder: '%£',
							real: '<span class="highlight search-term">'
						},

						TERM_END: {
							placeholder: '£%',
							real: '</span>'
						},
					}

					// first check for capital letters
					let startsWithCapticalLetters = /[A-Z]{1,}\s?/g
					if(startsWithCapticalLetters.test(searchTerm)){
						// get an array of letters
						searchTerm = searchTerm.replace(/\s/g, '')
						let capitalLetters = searchTerm.match(startsWithCapticalLetters)[0]

						let pattern = `(^|\\s)[${capitalLetters}]{1}`

						word = word.toString().replace(new RegExp(pattern, 'gi'), function (matchedText) {
							return (replacements.CAPITAL_START.placeholder + matchedText + replacements.CAPITAL_END.placeholder);
						});

						searchTerm = searchTerm.replace(capitalLetters, "")
					}

					let startOrEndSpacesRegExp = /^(\s+)|(\s+)$/g
					let twoOrMoreSpacesRegExp = /\s{2,}/g
					searchTerm = searchTerm.replace(startOrEndSpacesRegExp, "")
					searchTerm = searchTerm.replace(twoOrMoreSpacesRegExp, " ")

					// then do a basic check for the search term
					if(searchTerm != ""){
						var check = new RegExp(searchTerm, "ig");
						word = word.toString().replace(check, function (matchedText) {
							return (replacements.TERM_START.placeholder + matchedText + replacements.TERM_END.placeholder);
						});
					}

					// and finally...
					// replace placeholders with proper markup
					_.each(replacements, function(value){//}, key, obj){
						word = word.replace(new RegExp(value.placeholder, 'g'), value.real)
					})
				}

				return word

			},
		},

		///////////////////////////////////////////////////////////
		//
		// props
		//
		///////////////////////////////////////////////////////////


		props: {
			items: {
				type: Array,
				required: false,
				default: () => []
			},
			isAsync: {
				type: Boolean,
				required: false,
				default: false
			}
		},

		///////////////////////////////////////////////////////////
		//
		// directives
		//
		///////////////////////////////////////////////////////////

		directives: {focus},

		///////////////////////////////////////////////////////////
		//
		// computed
		//
		///////////////////////////////////////////////////////////


		computed: {
			searchTerm(){
				return this.$store.state.Search.searchTerm
			},
			isTourRunning(){
				return this.$store.state.Tour.isTourRunning
			},


			appHasFocus() {
				return this.$store.state.Focus.appHasFocus
			},

			hasTemplates() {
				return this.$store.state.Snippets.hasUserGeneratedSnippets
			},

			// outputs the message below the search field when the results are
			// not being shown
			infoMessage() {
				let message = "";

				if (this.search === "") {
					if (this.clipboard === "") {
						message = "Start typing to find one of your snippets.<br /><br />Remember you can search using any property of your snippets and you can use upper case characters to shortcut multi-word searches.<br /><br />You can also trigger me from the global keyboard shortcut <strong>CMD+Alt+C</strong> (OSX) or <strong>Ctrl+Alt+C</strong> (Win or Linux)"

						if(this.isTourRunning){
							message = ""
						}

					}
					else {
						message = `Copied to clipboard.<br /><br /><div class='preview'>${this.clipboard}</div>`
					}
				}
				else {
					if (this.results.length == 0) {
						message = "Sorry, couldn't find a match.<br /><br />Try typing `<code>Create snippet</code>` or `<code>Edit snippet</code>`."
					}
					else if (this.results.length == 1) {
						message = "Now hit <strong>Enter</strong>"
					}


				}

				return message;
			},

			currentState(){
				let state = "SEARCH_MODE"
				if(this.showPlaceHolderReplacementSystem){
					state = "PLACE_HOLDER_REPLACEMENT"
				}
				else if(this.clipboard != ""){
					state = "COPIED_TO_CLIPBOARD"
				}

				if(this.search == "" && state != "COPIED_TO_CLIPBOARD"){
					this.$root.$emit("NORMAL");
				}
				else{
					this.$root.$emit(state);
				}



				return state

			},

			selectedSnippetWithPlaceholdersPreview() {
				let preview = this.selectedSnippetWithPlaceholders
				preview = preview.replace(/</g, '&lt;')
				preview = preview.replace(/>/g, '&gt;')
				preview = preview.replace(this.currentPlaceholder, `<span class="placeholder-being-replaced">${this.currentPlaceholder}</span>`)

				if (this.currentPlaceholderInput != "") {
					preview = preview.replace(this.currentPlaceholder, this.currentPlaceholderInput)
				}

				return preview
			},

			enableWrapOnPreview() {
				let wrap = false
				if(this.selectedSnippet){
					wrap = this.selectedSnippet.language == "text"
				}
				return wrap
			},


		},

		///////////////////////////////////////////////////////////
		//
		// data
		//
		///////////////////////////////////////////////////////////


		data() {
			return {
				currentPlaceHolderHasOptions: false,
				isOpen: false,
				results: [],
				search: "",
				clipboard: "",
				isLoading: false,
				arrowCounter: 0,
				selectedSnippetWithPlaceholders: null,
				showPlaceHolderReplacementSystem: false,
				currentPlaceholder: null,
				currentPlaceholderInput: "",
				selectedSnippet: null,
				placeHolderArrowCounter: 0,
			};
		},

		///////////////////////////////////////////////////////////
		//
		// methods
		//
		///////////////////////////////////////////////////////////

		created: function(){
			window.addEventListener('TOUR_TYPING_LETTER', (event) => {
				var letter = event.detail.letter

				if(this.showPlaceHolderReplacementSystem || event.detail.stepNumber == 5){
					if (letter == '↑') {	// UP cursor key
						this.doPlaceHolderArrowUp()
					}
					else if (letter == '↓') {	// DOWN cursor key
						this.doPlaceHolderArrowDown()
					}
					else if (letter == '⏎') {	// ENTER key
						this.doPlaceHolderEnter()
					}
				}
				else{
					if (letter == '↑') {	// UP cursor key
						this.doArrowUp()
					}
					else if (letter == '↓') {	// DOWN cursor key
						this.doArrowDown()
					}
					else if (letter == '⏎') {	// ENTER key
						this.onEnter()
					}
				}
			})
		},

		methods: {
			onChange() {
				// Let's warn the parent that a change was made
				this.$emit("input", this.search);
				this.$store.commit(searchMutations.SET_SEARCH_TERM, this.search);

				// Is the data given by an outside ajax request?
				if (this.isAsync) {
					this.isLoading = true;
				} else {
					// Let's search our flat array
					this.filterResults();
					this.isOpen = true;
				}
			},

			filterResults() {
				this.results = this.$store.getters.applyFilter(this.search)

				this.arrowCounter = 0;
			},

			setResult(result) {
				if(result){
					// this.search = result || "";
					this.isOpen = false;

					this.setClipboard(result)
				}
			},

			onArrowDown(event) {
				event.preventDefault()

				if(!this.isTourRunning) {
					this.doArrowDown()
				}
			},

			doArrowDown(){
				this.isOpen = true;
				if (this.arrowCounter < this.results.length - 1) {
					this.arrowCounter = this.arrowCounter + 1;
				}
				else {
					this.arrowCounter = 0;
				}

				document.getElementById('autoCompleteResults').scrollTop = this.arrowCounter * ROW_HEIGHT
			},

			onArrowUp(event) {
				event.preventDefault()

				if(!this.isTourRunning) {
					this.doArrowUp()
				}
			},

			doArrowUp(){
				this.isOpen = true;
				if (this.arrowCounter > 0) {
					this.arrowCounter = this.arrowCounter - 1;
				}
				else {
					this.arrowCounter = this.results.length - 1;
				}

				document.getElementById('autoCompleteResults').scrollTop = this.arrowCounter * ROW_HEIGHT
			},

			onEnter() {
				this.setResult(this.results[this.arrowCounter])// || this.items[this.arrowCounter]);
			},

			onKeyDown(event){
				if(this.isTourRunning){
					event.preventDefault()

					const dialogOptions = {type: 'info', buttons: ['OK', 'Cancel'], message: 'Are you sure you want to exit the tour?'}

					dialog.showMessageBox(dialogOptions, i => {
						if(i == 0){	// ok button
							this.$store.commit(tourMutations.CLOSE_TOUR);
						}
						else if(i == 1){	// cancel button
							// do nothing
						}

					})
				}
			},

			onEscape() {
				this.clipboard = ""
				this.search = ""

				this.$store.commit(focusMutations.APP_BLUR)
			},

			handleClickOutside(evt) {
				if (!this.$el.contains(evt.target)) {
					this.isOpen = false;
					this.arrowCounter = -1;
				}
			},

			setClipboard(newValue) {
				let delay = 2000

				if (newValue.snippet) {
					if (newValue.language === 'Clippy') {

						// TODO handle this properly and do stuff
						// dispatch the appropriate mutation / action
						this.$store.commit(newValue.snippet)
						delay = 1
					}
					else {
						// its a live template / snipppet

						// check for placeholders, if we have placeholders we need to replace them all first
						if (placeholdersRegExp.test(newValue.snippet)) {

							delay = -1
							this.selectedSnippetWithPlaceholders = newValue.snippet
							this.selectedSnippet = newValue
							this.replaceNextSnippet()


						}
						else {
							this.clipboard = newValue.snippet;
							this.selectedSnippet = newValue

							this.search = "";
							clipboard.writeText(this.clipboard);
						}
					}

					// we are doing snippet replacement at -1
					if (delay !== -1) {
						setTimeout(() => {
							this.clipboard = ""
							this.search = ""

							this.$root.$emit("NORMAL");
							this.$store.commit(focusMutations.APP_BLUR)
							// if(!this.isTourRunning){
							// }
						}, delay);
					}

				}
			},


			///////////////////////////////////////////////////////////
			//
			// placeholder replacement
			//
			///////////////////////////////////////////////////////////


			replaceNextSnippet() {

				let placeholders = this.selectedSnippetWithPlaceholders.match(placeholdersRegExp) || []

				this.placeHolderArrowCounter = 0

				if (placeholders.length > 0) {
					this.showPlaceHolderReplacementSystem = true
					this.currentPlaceholder = placeholders[0]
					this.currentPlaceHolderHasOptions = this.getOptionsForCurrentPlaceholder().length > 0

				}
				else {
					this.showPlaceHolderReplacementSystem = false

					// we've replaced all the placeholders!
					this.clipboard = this.selectedSnippetWithPlaceholders;
					this.search = "";
					clipboard.writeText(this.clipboard);

					setTimeout(() => {
						this.clipboard = ""
						this.search = ""

						this.$store.commit(focusMutations.APP_BLUR)
						// if(!this.isTourRunning) {
						// }
					}, 2000);
				}
			},

			///////////////////////////////
			// keyboard handlers
			///////////////////////////////

			onPlaceHolderEnter(event) {
				event.preventDefault()

				if(!this.isTourRunning) {
					this.doPlaceHolderEnter()
				}
			},

			doPlaceHolderEnter(){

				// if(this.currentPlaceholderInput != ""){
				this.selectedSnippetWithPlaceholders = this.selectedSnippetWithPlaceholders.replace(this.currentPlaceholder, this.currentPlaceholderInput)
				this.currentPlaceholderInput = ""
				// }

				this.replaceNextSnippet()

				return false
			},

			onPlaceHolderEscape() {
				this.currentPlaceholder = ""
				this.selectedSnippetWithPlaceholders = ""
				this.currentPlaceholderInput = ""
				this.showPlaceHolderReplacementSystem = false
				this.currentPlaceHolderHasOptions = false
				this.search = ""
				this.clipboard = ""
				this.selectedSnippet = null
			},

			onPlaceHolderArrowDown(event) {
				event.preventDefault()

				if(!this.isTourRunning) {
					this.doPlaceHolderArrowDown()
				}
			},

			doPlaceHolderArrowDown(){
				this.goThroughVariables(1)
			},

			onPlaceHolderArrowUp(event) {
				event.preventDefault()

				if(!this.isTourRunning) {
					this.doPlaceHolderArrowUp()
				}
			},

			doPlaceHolderArrowUp(){
				this.goThroughVariables(-1)
			},

			getOptionsForCurrentPlaceholder() {
				let options = []
				if(this.selectedSnippet.variables){
					options = this.selectedSnippet.variables[this.currentPlaceholder.replace(/%/g, "")] || []
				}

				return options
			},

			goThroughVariables(delta) {
				let options = this.getOptionsForCurrentPlaceholder()
				if (options.length > 0) {
					let end = options.length - 1

					this.placeHolderArrowCounter = this.placeHolderArrowCounter + delta

					if (this.placeHolderArrowCounter < 0) {
						this.placeHolderArrowCounter = end
					}
					if (this.placeHolderArrowCounter > end) {
						this.placeHolderArrowCounter = 0
					}

					this.currentPlaceholderInput = options[this.placeHolderArrowCounter]

				}
			}
		},

		///////////////////////////////////////////////////////////
		//
		// watches
		//
		///////////////////////////////////////////////////////////


		watch: {
			items: function (val, oldValue) {
				// actually compare them
				if (val.length !== oldValue.length) {
					this.results = val;
					this.isLoading = false;
				}
			},

			searchTerm: function (newValue, oldValue){
				if(newValue != this.search){
					this.search = newValue
				}
			},

			// selectedSnippet: function(newValue, oldValue){
			// 	debugger
			// },

		},
		mounted() {
			// document.addEventListener("click", this.handleClickOutside);
		},

		destroyed() {
			// document.removeEventListener("click", this.handleClickOutside);
		}
	};


</script>

<!-- /////////////////////////////////////////////////////////////////

styles

///////////////////////////////////////////////////////////////// -->

<style src="./AutoComplete.less" lang="less" scoped></style>
