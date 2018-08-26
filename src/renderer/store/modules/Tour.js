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
	STEP_1: ' e x a m p l e',
	STEP_2: '↓  ↓  ⏎',
	STEP_3: 'PASTE',
	STEP_4: '↓    ⏎',
	STEP_5: '↓  ↓  ↓  ↑  ↑  ⏎  ↓  ↓  ↓  ↓  piggies  ⏎',
	STEP_6: 'S M     ↓  ⏎',
}

const state = {
	showTour: false,
	isTourRunning: false,
	messageIndex: 0,

	messages: [
		{
			text: `So I'm <strong>Cyrus</strong>, thanks for installing me.  As you have not set up any snippets of your own, lets find out how I can help you work smarter with some example snippets.<br /><br /><em>Btw you can dismiss this tour at any point by pressing any key (on your keyboard).</em>`,
			height: '230',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_1),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_1, 1)
			}
		},
		{
			text: `You can use your <strong>UP</strong> and <strong>DOWN</strong> keys to move through the results. Press <strong>ENTER</strong> to select one, which puts it into your clipboard ready to be pasted (<strong>${PASTE_KEYS}</strong>) into another application.`,
			height: '170',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_2, 1500),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_2, 2)

			}
		},
		{
			text: `Normally, I would disappear now to let you carry on with what you were doing, but for this tour I am going to hang around, lets paste (<strong>${PASTE_KEYS}</strong>) what we just found to trigger the next search.`,
			height: '230',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_3),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_3, 3)

			}
		},
		{
			text: `Now we are going to select the single result by pressing <strong>ENTER</strong>, but this one has <strong>Placeholders</strong> which we will need to fill them in before it can go into our clipboard.  `,
			height: '200',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_4, 0),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_4, 4)

			}
		},
		{
			text: `When a snippet has placeholders, before it goes into your clipboard you need to fill them in, by either typing a value or using your <strong>UP</strong> and <strong>DOWN</strong> keys to move through the options, <strong>ENTER</strong> moves through the placeholders.`,
			height: '190',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_5, 1350),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_5, 5)

			}
		},
		{
			text: `Feel free to try pasting your snippet into another application.  The next step for you is to set up some snippets for yourself.  You can also search for functions, lets search for the settings mode, this time we are going to use <strong>CAPITAL</strong> letters (SM) which search for the first letters of each word which is a quicker way to find stuff.`,
			height: '230',
			arrowX: '80',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_6),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_6, 6)

			}
		},
		{
			text: `This is the Settings main menu, from here you can add and edit your snippets as well as import and export options which allows you to share snippets across your team.<br /><br />Try adding in a new snippet, a good one to start with is <strong> My email address</strong>.`,
			height: '230',
			arrowX: '200',	// pointing at create new template
			delay: 1000,
			nextStep: () => {
				window.location.hash = '/settings/create'
			}
		},
		{
			text: `Now complete this form.<br /><br />This is the end of the tour, I'll leave you here to crack on and add a few snippets, useful ones that could help you get started are: My email address, My home address, My mobile number etc.. and you should have a play with placeholders too.`,
			height: '220',
			arrowX: '-200',	// hiding
			delay: 2000,
			nextStep: () => {
				window.location.hash = '/settings/create'
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
		state.messageIndex = 6

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