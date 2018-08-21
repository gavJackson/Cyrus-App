<template>
	<div class="agent"

		 @click="onAgentClick"
		 @mousedown="onAgentMouseDown"
		 @mouseup="onAgentMouseUp" >

		<speech-bubble v-if="showSpeechBubble"></speech-bubble>

		<img id="agentImage"
			 src="~@/assets/images/agents/clippy/ClippyWithPaper.png"/>

		<div class="agent-state">{{ agentState }}</div>

	</div>
</template>

<script>

	import SpeechBubble from '../AgentPage/SpeechBubble'
	import { focusMutations } from './../../store/types'

	const agentStates = {
		NORMAL: "NORMAL",
		SEARCHING: "SEARCHING",
		DRAGGING: "DRAGGING"
	}

	export default {
		name: "Clippy",

		components: {
			'speechBubble': SpeechBubble,
		},

		data: function () {
			return {
				agentState: agentStates.NORMAL,
				showSpeechBubble: false,
				mouseDownTimer: null
			}
		},

		mounted: function() {
			this.$root.$on('NORMAL', () => this.agentState = "NORMAL" );
			this.$root.$on('SEARCH_MODE', () => this.agentState = "SEARCHING" );
			this.$root.$on('PLACE_HOLDER_REPLACEMENT', () => this.agentState = "PLACEHOLDER" );
			this.$root.$on('COPIED_TO_CLIPBOARD', () => this.agentState = "FOUND" );
		},

		methods: {
			onAgentClick() {
				this.$store.commit(focusMutations.APP_FOCUS)
				this.showSpeechBubble = true
				this.agentState = agentStates.NORMAL
			},

			// only starts `dragging` if the mouse is held down for a second or so
			onAgentMouseDown() {
				if(this.mouseDownTimer){
					clearInterval(this.mouseDownTimer)
				}

				this.mouseDownTimer = setTimeout( () => {
					this.showSpeechBubble = false
					this.agentState = agentStates.DRAGGING
				}, 250)

			},

			onAgentMouseUp() {
				if(this.mouseDownTimer){
					clearInterval(this.mouseDownTimer)
				}

				this.showSpeechBubble = true
				this.agentState = agentStates.NORMAL
			}

		}

	}
</script>

<style scoped>
	.agent {
		-webkit-app-region: drag;

		background-color: transparent;
		width: 100px;
		height: 93px;
		background-size: contain;
		background-repeat: no-repeat;
		position: absolute;
		right: 0px;
		bottom: 0px;
	}

	#agentImage {

		width: 100px;
		height: 93px;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		pointer-events: none;
	}

	.agent:focus {
		outline: none;
	}

	.agent-state{
		position: absolute;
		text-align: center;
		bottom: 0px;
		margin: 0px auto;
		padding: 2px 5px;
		font-size: 10px;

		background-color: black;
		color: lightgreen;
		border: 1px solid lightgreen;
	}

</style>