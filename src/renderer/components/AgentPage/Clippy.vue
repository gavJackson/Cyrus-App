<template>
	<div class="agent"

		 @click="onAgentClick"
		 @mousedown="onAgentMouseDown"
		 @mouseup="onAgentMouseUp" >

		<speech-bubble v-if="showSpeechBubble"></speech-bubble>

		<img id="agentImage"
			 src="~@/assets/images/agents/clippy/ClippyWithPaper.png"/>

		<div class="agent-state">{{ agentState }}</div>

		<div class="current-tour-key-being-pressed animated zoomIn faster"

			 v-if="letterChanged">
			{{ currentTourKeyBeingPressed }}
		</div>

		<div class="tour-start-dialog dialog" v-if="shouldShowTourStarter">

			Hi there, I'm <strong>Cyrus</strong>, press <strong>{{keys}}</strong> or <a class="button primary">Click here</a> to activate me.

		</div>

	</div>
</template>

<script>

	import SpeechBubble from '../AgentPage/SpeechBubble'
	import { focusMutations } from './../../store/types'
	import is from 'electron-is'

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
				mouseDownTimer: null,
				currentTourKeyBeingPressed: null,
				letterChanged: false
			}
		},

		created: function() {
			window.addEventListener('TOUR_TYPING_LETTER', (event) => {
				this.currentTourKeyBeingPressed = event.detail.letter

				this.agentState = event.detail.stepNumber
			} );

		},

		mounted: function() {
			// this.$root.$on('NORMAL', () => this.agentState = "NORMAL" );
			// this.$root.$on('SEARCH_MODE', () => this.agentState = "SEARCHING" );
			// this.$root.$on('PLACE_HOLDER_REPLACEMENT', () => this.agentState = "PLACEHOLDER" );
			// this.$root.$on('COPIED_TO_CLIPBOARD', () => this.agentState = "FOUND" );

		},

		computed: {
			shouldShowTourStarter(){
				return this.$store.state.Tour.isTourRunning && !this.showSpeechBubble
			},

			keys(){
				return this.$store.getters.getShortcutKeys()

			}
			//
			// shouldShowSpeechBubble(){
			// 	return this.$store.state.Tour.isTourRunning || this.showSpeechBubble
			// }
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

		},

		watch: {
			currentTourKeyBeingPressed: function (newValue, oldValue) {
				if(newValue != null){
					this.letterChanged = true

					var delay = newValue == '⏎' || newValue.length > 1 ? 2000 : 500

					setTimeout( () => {
						this.letterChanged = false

						setTimeout( () => this.currentTourKeyBeingPressed = null, 1)
					}, delay)
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	@import "../../assets/styles/global.less";

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

	.current-tour-key-being-pressed{
		opacity: 0.9;

		border-radius: 10px;
		font-family: @codeFont;
		position: absolute;
		background-color: fade(black, 40%);
		color: white;
		bottom: 0px;
		/*width: 75px;*/
		height: 75px;
		line-height: 75px;
		text-align: center;
		font-size: 60px;
		padding: 0px 20px;
		border: 5px solid white;
		display: inline-block;
		left: -282px;
	}

	.tour-start-dialog{
		position: absolute;
		color: white;
		bottom: 100px;
		left: -200px;
		width: 200px;
		color: @textColor;

		&:after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 65%;
			width: 0;
			height: 0;
			border: 26px solid transparent;
			border-top-color: #ffffcd;
			border-bottom: 0;
			border-right: 0;
			margin-left: 40px;
			margin-bottom: -26px;
		}
	}

</style>