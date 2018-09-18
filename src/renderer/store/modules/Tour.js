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
	STEP_1: 'e  m  ail',
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
			text: `You control me with your keyboard by telling me <strong>What do you want to do</strong> to search for snippets or functions that I can perform.<br /><br />As you have not set up any snippets of your own, I've added a couple of examples and we'll use them in this tour to find out how I can help you work smarter.<br /><br />First lets search for our email snippets. During the tour the keys that I am pressing will appear below.`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Lets get started',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_1),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_1, 1, state)
			}
		},
		{
			text: `Our search has returned two results as both example snippets have the word <em>email</em> in their names. When you have more than one result you can scroll through them with the <strong>UP</strong> and <strong>DOWN</strong> keys. Pressing <strong>ENTER</strong> selects one.`,
			height: '170',
			arrowX: '80',
			buttonLabel: 'Show me',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_2, 1500),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_2, 2, state)

			}
		},
		{
			text: `Normally, I would disappear now to let you carry on with what you were doing, but for this tour I am going to hang around to show you how snippets with <em>Placeholders</em> work.  A placeholder is a replaceable bit of text in the  snippet.  We are going to paste (<strong>${PASTE_KEYS}</strong>) what we just found in the search box above to find our next snippet.`,
			height: '230',
			arrowX: '80',
			buttonLabel: 'Search for the placeholder example',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_3),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_3, 3, state)

			}
		},
		{
			text: `Now we are going to select the second result by pressing <strong>DOWN</strong> and then <strong>ENTER</strong>, and as this one has <strong>Placeholders</strong> we will need to fill them in before it can go into our clipboard.  `,
			height: '160',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_4, 2000),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_4, 4, state)

			}
		},
		{
			text: `This is our example spam email snippet.`,
			height: '100',
			arrowX: '150',
			buttonLabel: 'Tell me more...',
			delay: 0,
			nextStep: () => {

			}
		},
		{
			text: `We are now going to fill in all three placeholders from this example snippet, (Recipient, Reason and Sign off).<br /><br />Each placeholder is a word surrounded by %, e.g. <strong>%RECIPIENT%</strong> and can either be free text or if options have been defined, you can scroll through them using the <strong>UP</strong> and <strong>DOWN</strong> keys.<br /><br />Hitting, <strong>ENTER</strong> moves through the placeholders until all are satisfied and then the snippet with the replacements are placed in your clipboard ready to be pasted into another application (<strong>${PASTE_KEYS}</strong>).`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Lets fill in placeholders',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_5, 1350),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_5, 5, state)

			}
		},
		{
			text: `Try pasting your snippet into another application (<strong>${PASTE_KEYS}</strong>).<br /><br>The next thing I want to show you is <strong>how to create your own snippets</strong> and a nifty searching trick.<br /><br />You can search for functions not just snippets AND you can use <strong>CAPITAL</strong> letters to search for the first letters of each word, so to get into <strong>S</strong>ettings <strong>M</strong>ode we can enter <strong>SMode</strong>.`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Show me the nifty searching trick',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_6),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_6, 6, state)

			}
		},
		{
			text: `This is <strong>Settings mode</strong>, where you can manage your snippets. Lets <strong>Import snippets</strong> to get you started.`,
			height: '120',
			arrowX: '200',	// pointing at create new template
			delay: 0,
			nextStep: () => {
				window.location.hash = '/settings/import'
			}
		},
		{
			text: `This is <strong>the end of the tour</strong>, I'll leave you on Import snippets to crack on and add a few snippets (click the <strong>download button</strong>). I hope this tour has been helpful and remember you can restart the tour it if you want to go through again.`,
			height: '170',
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