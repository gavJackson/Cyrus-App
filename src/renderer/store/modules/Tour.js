import {tourMutations, systemMutations } from '../types'
import is from 'electron-is'

///////////////////////////////////////////////////////////
//
// state / tour definition
//
///////////////////////////////////////////////////////////


///////////////////////////////
// helper function
///////////////////////////////
var stepDelay = 550

function getTypeWriterDuration(word, extra = 0) {
	var length = word.length
	if(word == 'PASTE') {
		length = 1
	}
	return extra + stepDelay + (length * stepDelay)
}

let PASTE_KEYS = "ctrl+v"
if(is.macOS()){
	PASTE_KEYS = "cmd+v"
}


function typeWriterEffect(word, stepNumber, state) {
	// need to make sure the tour is still running
	if(state.isTourRunning) {
		const keyCodes = {
			UP: 38,
			DOWN: 40,
			ENTER: 13,
		}

		var el = document.getElementById('inputSearch');

		if (stepNumber == 5) {
			el = document.getElementById('inputPlaceholder');
		}

		if (word == 'PASTE') {
			window.dispatchEvent(new CustomEvent("TOUR_TYPING_LETTER", {
				detail: {
					letter: PASTE_KEYS,
					stepNumber: stepNumber
				}
			}));

			el.value = 'email';

			setTimeout((state) => {
				// need to make sure the tour is still running
				if (state.isTourRunning) {
					el.value = 'email';
					el.dispatchEvent(new Event('input'))
				}
			}, 100, state)
		}
		else {
			var typed = ""
			for (var i = 0; i < word.length; i++) {
				typed = typed + word.charAt(i)

				var delay = stepDelay * i
				if (word.charAt(i) == '⏎') {
					delay = delay + stepDelay
				}

				setTimeout((wordToType, letter, state) => {
					// need to make sure the tour is still running
					if (state.isTourRunning) {

						var dispatchKeyPress = true
						if (letter == '↑') {	// UP cursor key

						}
						else if (letter == '↓') {	// DOWN cursor key

						}
						else if (letter == '⏎') {	// ENTER key

						}
						else if (letter == ' ') {	// space key
							dispatchKeyPress = false
						}
						else {	// a proper input key
							el.value = wordToType.replace(/\W/g, '');
							el.dispatchEvent(new Event('input'))
						}

						if (dispatchKeyPress) {
							window.dispatchEvent(new CustomEvent("TOUR_TYPING_LETTER", {
								detail: {
									letter: letter,
									stepNumber: stepNumber
								}
							}));
						}
					}

				}, delay, typed, word.charAt(i), state);
			}
		}
	}
}

var tourKeyboardInputs = {
	STEP_1: 'e m ail',
	STEP_2: '↓  ↑   ⏎',
	STEP_3: 'PASTE',
	STEP_4: '↓⏎',
	STEP_5: '↓↓↓⏎↓↓↓↑⏎↓↓↓ Adios  ⏎',
	STEP_6: 'S M o de  ↓  ⏎',
}

const state = {
	showTour: false,
	isTourRunning: false,
	haveClickedOnVideoLink: false,
	messageIndex: 0,

	messages: [
		{
			text: `Type in here to search for snippets or functions that I can perform.<br /><br />We'll search for one of our sample email snippets.`,
			xheight: '290',
			height: '230',
			arrowX: '80',
			buttonLabel: 'Lets get started',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_1),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_1, 1, state)
			}
		},
		{
			text: `Search results narrow down as you type and are shown here.  You can use your keyboard to select one.`,
			height: '170',
			arrowX: '80',
			buttonLabel: 'Show me',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_2, 1500),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_2, 2, state)

			}
		},
		{
			text: `The snippet is in your clipboard, ready to be pasted into another application.  Normally I would disappear now, but I am going to show you how snippets with <em>Placeholders</em> work (replaceable bit of text in a snippet).<br /><br />We'll paste (<strong>${PASTE_KEYS}</strong>) what we just found in the search box ton continue the tour.`,
			height: '230',
			arrowX: '80',
			buttonLabel: 'Paste',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_3),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_3, 3, state)

			}
		},
		{
			text: `Now we are going to select the second result which has <strong>Placeholders</strong> that will need to be filled in before it can go into our clipboard.  `,
			height: '160',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_4, 2000),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_4, 4, state)

			}
		},
		{
			text: `This is snippet has placeholders...`,
			height: '90',
			arrowX: '150',
			buttonLabel: 'Ok',
			delay: 0,
			nextStep: () => {

			}
		},
		{
			text: `There are three placeholders in this example snippet, (Recipient, Reason and Sign off).<br /><br />Each placeholder is a word surrounded by %, e.g. <strong>%RECIPIENT%</strong> and can be free text or picked from a list of options.<br /><br />Once all placeholders are satisfied the completed snippet goes into your clipboard ready to be pasted into another application (<strong>${PASTE_KEYS}</strong>).`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Lets fill in placeholders',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_5, 1350),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_5, 5, state)

			}
		},
		{
			text: `Try pasting your snippet into another application (<strong>${PASTE_KEYS}</strong>).<br /><br>The next thing I want to show you is a nifty searching trick: You can search for functions not just snippets and you can use <strong>CAPITAL</strong> letters to search for the first letters of each word, so to get into <strong>S</strong>ettings <strong>M</strong>ode we can enter <strong>SMode</strong>.`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Show me the nifty searching trick',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_6),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_6, 6, state)

			}
		},
		{
			text: `This is <strong>Settings mode</strong>, where you can manage your snippets. <strong>Import snippets</strong> is a good place to get started.`,
			height: '120',
			arrowX: '200',	// pointing at create new template
			delay: 2000,
			nextStep: () => {
				window.location.hash = '/settings/import'
			}
		},
		{
			text: `This is <strong>the end of the tour</strong>, I'll leave here to crack on and import a few snippets.<br /><br/>I hope this tour has been helpful and remember that together we can work smarter!<br /><br /><br /><br /><h1 class="comic">CYRUS</h1><br /><br />`,
			height: '400',
			arrowX: '-200',	// hiding
			delay: 0,
			buttonLabel: 'Close tour',
			nextStep: () => {

			}
		},
	]
}

const mutations = {
	[tourMutations.CLOSE_TOUR]() {
		state.showTour = false
		state.isTourRunning = false
		state.messageIndex = 0
	},

	[tourMutations.HIDE_TOUR]() {
		state.showTour = false
	},

	[tourMutations.SHOW_TOUR]() {
		state.showTour = false
	},

	[tourMutations.START]() {
		state.messageIndex = 0
		state.isTourRunning = true
		state.showTour = true
	},

	[tourMutations.NEXT_STEP]() {
		state.showTour = true
		state.messageIndex++

		if(state.messageIndex >= state.messages.length){
			state.showTour = false
			state.isTourRunning = false
			state.messageIndex = 0
		}
	},

	[tourMutations.JUMP_TO_SETTINGS_BIT]() {
		state.messageIndex = 7

		// TODO remove these two
		state.showTour = true
		state.isTourRunning = true

	},
	[tourMutations.HAVE_CLICKED_VIDEO_LINK]() {
		state.haveClickedOnVideoLink = true
	},
}

const getters = {
	getCurrentMessage: (state) => () => {
		return this.messages[this.messageIndex]
	},

	getShowTour: (state) => () => {
		return this.showTour
	}

}

export default {
	state,
	mutations,
	getters
}