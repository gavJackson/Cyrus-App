import {tourMutations, searchMutations} from '../types'
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
				if (letter == '↑') {	// UP cursor key

				}
				else if (letter == '↓') {	// DOWN cursor key

				}
				else if (letter == '⏎') {	// ENTER key

				}
				else {
					el.value = wordToType.replace(/\W/g,'');
					el.dispatchEvent(new Event('input'))
				}

				window.dispatchEvent(new CustomEvent("TOUR_TYPING_LETTER", {
					detail: {
						letter: letter,
						stepNumber: stepNumber
					}}));

			}, delay, typed, word.charAt(i));
		}
	}
}

var tourKeyboardInputs = {
	STEP_1: 'example',
	STEP_2: '↓↓↑⏎',
	STEP_3: 'PASTE',
	STEP_4: '↓⏎',
	STEP_5: '↓↓↓↑↑⏎↓↓↓↓piggies⏎',
	STEP_6: 'SM↓⏎',
}

const state = {
	showTour: false,
	isTourRunning: false,
	messageIndex: 0,

	messages: [
		{
			text: `So I'm <strong>Cyrus</strong>, thanks for installing me.  As you have not set up any snippets of your own, lets find out how I can help you work smarter with some example snippets.<br /><br /><em>Btw you can dismiss this tour at any point by pressing any key (on your keyboard).</em>`,
			height: '230',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_1),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_1, 1)
			}
		},
		{
			text: `You can use your <strong>UP</strong> and <strong>DOWN</strong> keys to move through the results.  When you have found the one you want, press <strong>ENTER</strong> to put it into your clip board ready to be pasted into another application (${PASTE_KEYS}).`,
			height: '170',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_2, 1650),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_2, 2)

			}
		},
		{
			text: `Normally, I would disappear now to let you carry on with what you were doing, but for this tour I am going to hang around, lets paste what we just found to trigger the next search.`,
			height: '230',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_3),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_3, 3)

			}
		},
		{
			text: `Now we are going to select the single result by pressing <strong>ENTER</strong>, but this one has <strong>Placeholders</strong> which we will need to fill them in before it can go into our clipboard.  `,
			height: '200',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_4, 0),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_4, 4)

			}
		},
		{
			text: `To fill placeholders you can either type a value or use your <strong>UP</strong> and <strong>DOWN</strong> keys to move through the options, <strong>ENTER</strong> moves through all the placeholders.`,
			height: '180',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_5, 1650),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_5, 5)

			}
		},
		{
			text: `Feel free to try pasting your snippet into another application.  The next step for you is to set up some snippets for yourself.  You can also search for functions, lets search for the settings mode, this time we are going to use <strong>CAPITAL</strong> letters (SM) which search for the first letters of each word which is a quicker way to find stuff.`,
			height: '230',
			delay: getTypeWriterDuration(tourKeyboardInputs.STEP_6),
			nextStep: () => {
				typeWriterEffect(tourKeyboardInputs.STEP_6, 6)

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