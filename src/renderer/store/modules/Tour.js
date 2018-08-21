import {tourMutations} from '../types'

const state = {
	isRunningTour: false,
	shouldSkipTour: false,
	restartTour: false,
	messageIndex: null,

	messages : [
		{
			text: `Hi there, I'm <strong>Cyrus</strong>! - lets find out how I can help you work smarter with live templates.<br /><br />You don't have any templates set up, but i've added a couple of examples to get you started.<br /><br />Try typing \`<strong><code>a simple example</code></strong>\` to see how this works.`,
			height: '230px',
			delay: 1000,
			nextStep: () => {
				var el = document.getElementById('inputSearch');
				el.value='example'
				setTimeout ( () => el.dispatchEvent(new Event('input')), 100);
			}
		},



	]

}

const mutations = {
	[tourMutations.DONT_SHOW_AGAIN](){

	},

	[tourMutations.START](){
		this.messageIndex = 0
	},

	[tourMutations.NEXT_STEP](){
		this.messageIndex++
	},
}

const getters = {
	getCurrentMessage: (state) => () => {
		return this.messages[this.messageIndex]
	},

	getShowTour: (state) => () => {
		return this.messageIndex >= 0
	}

}

export default {
	state,
	mutations,
	getters
}