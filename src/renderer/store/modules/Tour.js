import {tourMutations} from '../types'

const state = {
	showTour: false,
	messageIndex: 0,

	messages : [
		{
			text: `<strong>Tour step 1:</strong> Try typing \`<strong><code>a simple example</code></strong>\` to see how this works (or just click next if you are feeling lazy).<br /><hr />Hi there, I'm <strong>Cyrus</strong>! - lets find out how I can help you work smarter with live templates.`,
			height: '220',
			delay: 1000,
			nextStep: () => {
				var el = document.getElementById('inputSearch');
				el.value='example'
				setTimeout ( () => el.dispatchEvent(new Event('input')), 100);
			}
		},
		{
			text: `<strong>Tour step 2:</strong> Use your UP and DOWN keys to move through the results, click or press ENTER on the first item. This will put it into your clip board ready to be pasted into another application (Ctrl+V or CMD+V).`,  //<br /><hr />You don't have any templates set up, but I've added a couple of examples to get you started.`,
			height: '170',
			delay: 1000,
			nextStep: () => {

			}
		},



	]

}

const mutations = {
	[tourMutations.CLOSE_TOUR](){
		state.showTour = false
	},

	[tourMutations.HIDE_TOUR](){
		state.showTour = false
	},

	[tourMutations.SHOW_TOUR](){
		state.showTour = false
	},

	[tourMutations.START](){
		state.messageIndex = 0
		state.showTour = true
	},

	[tourMutations.NEXT_STEP](){
		state.showTour = true
		state.messageIndex++
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