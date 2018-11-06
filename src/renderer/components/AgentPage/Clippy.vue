<template>
	<div class="agent"

		 @click="onAgentClick"
		 @mousedown="onAgentMouseDown"
		 @mouseup="onAgentMouseUp" >

		<!-- /////////////////////////////////////////////////////////////////

		speech bubble

		///////////////////////////////////////////////////////////////// -->

		<speech-bubble v-if="showSpeechBubble"></speech-bubble>

		<!-- /////////////////////////////////////////////////////////////////

		agent image

		///////////////////////////////////////////////////////////////// -->

		<!--<img id="agentImage" v-bind:src="agentImage" />-->

		<img id="agentImage"
			 src="static/images/agents/Clippy/ClippyWithPaper.png"/>

		<div class="agent-state">
			BETA v{{ versionNumber }}
			<!--{{ shouldShowTourStarter }} {{ showSpeechBubble }} {{ appHasFocus }}-->
			<!--{{ agentState }}-->
		</div>

		<!-- /////////////////////////////////////////////////////////////////

		tour stuff

		///////////////////////////////////////////////////////////////// -->

		<div class="current-tour-key-being-pressed animated zoomIn faster"

			 v-if="showLetter">
			{{ currentTourKeyBeingPressed }}
		</div>

		<div class="tour-start-dialog dialog animated fadeIn" v-if="shouldShowTourStarter">

			Hi! I'm CYRUS, I'm a productivity tool and I give quick and easy access to useful bits of text (<strong>snippets</strong>).
			<br /><br />
			I can be activated even when you are in another application, by pressing <br /><strong>{{keys}}</strong>.
			<br /><br />
			Lets start with a tour of my features, try the shortcut keys or..
			<br /><br /><a class="button primary">Click here</a> to begin the tour.

		</div>



	</div>
</template>

<script>
    const { app } = require('electron').remote;
	const shell = require('electron').shell;

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
				mouseDownTimer: null,
				currentTourKeyBeingPressed: null,
				letterChanged: false,
				versionNumber: null,
			}
		},

		created: function() {
			window.addEventListener('TOUR_TYPING_LETTER', (event) => {
				this.currentTourKeyBeingPressed = event.detail.letter

				// this.agentState = event.detail.stepNumber
			} );

			var self = this
			app.on('GLOBAL_SHORT_CUT_KEY', () => {
				self.showSpeechBubble = true
			} );

			this.versionNumber = app.getVersion()
		},

		mounted: function() {
			this.$root.$on('NORMAL', () => this.agentState = "NORMAL" );
			this.$root.$on('SEARCH_MODE', () => this.agentState = "SEARCHING" );
			this.$root.$on('PLACE_HOLDER_REPLACEMENT', () => this.agentState = "PLACEHOLDER" );
			this.$root.$on('COPIED_TO_CLIPBOARD', () => this.agentState = "FOUND" );

		},

		computed: {
            appHasFocus() {
                return this.$store.state.Focus.appHasFocus
            },
            isTourRunning() {
                return this.$store.state.Tour.isTourRunning
            },


            showLetter(){
				return this.currentTourKeyBeingPressed && /\S/.test(this.currentTourKeyBeingPressed)
			},
			shouldShowTourStarter(){
				return this.isTourRunning && !this.showSpeechBubble && this.agentState != agentStates.DRAGGING
			},

			keys(){
				return this.$store.getters.getShortcutKeys()
			},

			agentImage(){
				return this.$store.getters.getAgentImage()
			}
		},

		methods: {
			onAgentClick() {
			    //debugger
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
			},

			openLink: function(url, event){
				event.preventDefault()

				shell.openExternal(url)

				return false

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
			},

            appHasFocus: function (newValue){
				if(newValue == true){
					this.showSpeechBubble = newValue
				}
				else{
					if(!this.isTourRunning){
						this.showSpeechBubble = newValue
					}
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	@import "../../assets/styles/global.less";

	.agent {
		-webkit-app-region: drag;

		//background-color: green;//transparent;
		width: 100px;
		height: 100px;
		background-size: contain;
		background-repeat: no-repeat;
		position: absolute;
		right: 0px;
		bottom: 0px;
	}



	#agentImage {
		width: 100px;
		height: 100px;
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
		right: 100px;
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
		/*color: white;*/
		bottom: 100px;
		left: -300px;
		width: 320px;
		color: @codeText;
		font-size: 13px;

		&:after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 75%;
			width: 0;
			height: 0;
			border: 13px solid transparent;
			border-top-color: @codeBackground;
			border-bottom: 0;
			border-right: 0;
			margin-left: 40px;
			margin-bottom: -13px;
		}
	}

</style>