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


function typeWriterEffect(word, stepNumber) {
	const keyCodes = {
		UP: 38,
		DOWN: 40,
		ENTER: 13,
	}

	var el = document.getElementById('inputSearch');

	if(stepNumber == 5){
		el = document.getElementById('inputPlaceholder');
	}

	if(word == 'PASTE'){
		window.dispatchEvent(new CustomEvent("TOUR_TYPING_LETTER", {
			detail: {
				letter: PASTE_KEYS,
				stepNumber: stepNumber
			}}));

		el.value = 'example snippet';

		setTimeout( () => {
			el.value = 'example snippet';
			el.dispatchEvent(new Event('input'))
		}, 100)
	}
	else{
		var typed = ""
		for (var i = 0; i < word.length; i++) {
			typed = typed + word.charAt(i)

			var delay = stepDelay * i
			if(word.charAt(i) =='⏎'){
				delay = delay + stepDelay
			}

			setTimeout((wordToType, letter) => {
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
					el.value = wordToType.replace(/\W/g,'');
					el.dispatchEvent(new Event('input'))
				}

				if(dispatchKeyPress){
					window.dispatchEvent(new CustomEvent("TOUR_TYPING_LETTER", {
						detail: {
							letter: letter,
							stepNumber: stepNumber
						}}));
				}

			}, delay, typed, word.charAt(i));
		}
	}
}

var tourKeyboardInputs = {
	STEP_1: 'e  x  a mple',
	STEP_2: '↓  ↑  ⏎',
	STEP_3: 'PASTE',
	STEP_4: '↓⏎',
	STEP_5: '↓  ↓  ⏎  ↓  ↓  ↓  ↓  piggies  ⏎',
	STEP_6: 'S M     ↓  ⏎',
}

const state = {
	showTour: false,
	isTourRunning: false,
	messageIndex: 0,

	messages: [
		{
			text: `You control me with your keyboard using the field above to search for a snippet or even a function that I can perform.<br /><br />As you have not set up any snippets of your own, I've added a couple of examples and we'll use them to find out how I can help you work smarter.<br /><br />`,
			height: '230',
			arrowX: '80',
			buttonLabel: 'Lets get started',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_1),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_1, 1)
			}
		},
		{
			text: `Our search has returned two results, you could scroll through them with the <strong>UP</strong> and <strong>DOWN</strong> keys. Pressing <strong>ENTER</strong> selects one to put into your clipboard, ready to be pasted (<strong>${PASTE_KEYS}</strong>) into another application.`,
			height: '170',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_2, 1500),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_2, 2)

			}
		},
		{
			text: `Normally, I would disappear now to let you carry on with what you were doing, but for this tour I am going to hang around to show you how snippets with <strong>Placeholders</strong> work.  A placeholder is a replaceable part of your snippet.  We are going to paste (<strong>${PASTE_KEYS}</strong>) what we just found in the search box above to find our next snippet.`,
			height: '230',
			arrowX: '80',
			buttonLabel: 'Search for the placeholder example',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_3),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_3, 3)

			}
		},
		{
			text: `Now we are going to select the single result by pressing <strong>ENTER</strong>, and as this one has <strong>Placeholders</strong> we will need to fill them in before it can go into our clipboard.  `,
			height: '200',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_4, 2000),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_4, 4)

			}
		},
		{
			text: `This is our example snippet and its placeholders (replaceable bits of text).`,
			height: '100',
			arrowX: '150',
			buttonLabel: 'Tell me more...',
			delay: 0,
			nextStep: () => {

			}
		},
		{
			text: `We are now going to fill in two placeholders from this example snippet, (Colours and Animals). Each placeholder can either be free text or if options have been defined, you can scroll through them using the <strong>UP</strong> and <strong>DOWN</strong> keys. Hitting, <strong>ENTER</strong> moves through the placeholders until all are satisfied and then the snippet with the replacements are placed in your clipboard.`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Lets fill in placeholders',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_5, 1350),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_5, 5)

			}
		},
		{
			text: `Try pasting your snippet into another application (<strong>${PASTE_KEYS}</strong>).<br /><br>The next thing I want to show you is <strong>how to create your own snippets</strong> and a nifty searching trick.<br /><br />You can search for functions not just snippets AND you can use <strong>CAPITAL</strong> letters to search for the first letters of each word, so to get into <strong>S</strong>ettings <strong>M</strong>ode we can enter <strong>SM</strong>.`,
			height: '290',
			arrowX: '-80',
			buttonLabel: 'Show me the nifty searching trick',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_6),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_6, 6)

			}
		},
		{
			text: `This is <strong>Settings mode</strong>.  From here you can add and edit your snippets as well as import and export options which allows you to share snippets.<br /><br />Lets <strong>Create a new snippet</strong>, I reckon a good one to start with would be your email address, perhaps call it <strong> My email address</strong>.`,
			height: '230',
			arrowX: '200',	// pointing at create new template
			delay: 1000,
			nextStep: () => {
				window.location.hash = '/settings/create'
			}
		},
		{
			text: `So this is the New Snippet form. Use this to enter your own snippets and I'll make sure they are always readily accessible allowing you to work smarter.`,
			height: '130',
			arrowX: '200',	// pointing in the middle
			delay: 0,
			nextStep: () => {

			}
		},
		{
			text: `This is <strong>the end of the tour</strong>, I'll leave you on the Create new snippet form to crack on and add a few snippets, useful ones that could help you get started are: <ul><li>My email address</li><li>My home address</li><li>My mobile number</li></ul>I hope this tour has been helpful, you can restart it if you want to go through again.<br /><br />Happy snipping!<br /><br /><strong style="font-size: 30px">Cyrus</strong><br /><br />`,
			height: '400',
			arrowX: '-200',	// hiding
			delay: 0,
			buttonLabel: 'Close tour and enter my own snippet',
			nextStep: () => {

			}
		},


	]

}

const mutations = {
	[tourMutations.CLOSE_TOUR]() {
		state.showTour = false
		state.isTourRunning = false
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