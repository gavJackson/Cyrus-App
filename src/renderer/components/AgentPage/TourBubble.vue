<template>
	<div class="thought-container animated fadeIn faster"
		 v-bind:class="{ 'in-settings': isSettingsMode }"
			 v-bind:style="{ 'height': message.height + 'px',
							 '--arrow-position-x-var': (message.arrowX) + 'px',
							 '--arrow-position-y-var': (270 - message.height) + 'px',
							 '--arrow-position-settings-y-var': (360 - message.height) + 'px'}"
			 v-if="message">


		<div class="thought-dialog">
			<!--<div class="xdont-show-again-container">-->
			<!--</div>-->
			<!--<br />-->
			<!--<div class="tour-message"-->

			<!--</div>-->

			<div class="tour-message" v-html="message.text"></div>

			<button class="button primary"
					@click="onTourNext()">{{ message.buttonLabel || nextStepButtonLabel }}</button>

			<br />
			<br />

			<div>
				If you want to find out more about snippets and what I can do, <a @click="openLink('https://youtu.be/Mf8PFIL-4cQ', $event)" target="_blank">Watch my intro video on YouTube</a>.
			</div>

			<em v-if="!isSettingsMode">
				<br />
				Btw you can dismiss this tour at any point by pressing any key (on your keyboard).
			</em>

		</div>

	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import {tourMutations} from '../../store/types'
	const shell = require('electron').shell;

	export default {
		name: "TourBubble",

		props: ['isSettingsMode'],


		computed: mapState({
			messageIndex: state => state.Tour.messageIndex,
			message: state => {
				return state.Tour.messages[state.Tour.messageIndex]
			},
			nextStepButtonLabel: state => {
				if(state.Tour.messageIndex == state.Tour.messages.length - 1)
				{
					return "Close tour"
				}
				else{
					return "Next"
				}
			}
		}),

		methods: {
			openLink: function(url, event){
				event.preventDefault()

				shell.openExternal(url)

			},

			onTourClose(){
				this.$store.commit(tourMutations.CLOSE_TOUR)
			},

			onTourNext(){
				if(this.message){
					this.$store.commit(tourMutations.HIDE_TOUR)

					if(this.message.nextStep){
						this.message.nextStep.call(this)
					}

					setTimeout( () => {
						this.$store.commit(tourMutations.NEXT_STEP)
					}, this.message.delay || 1)
				}
			},

		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/styles/global.less";

	@tourBackground: mix(@backgroundColor, black, 80%);

	.thought-container {
		border-radius: 3px;
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 0px;
		display: block;
		height: 230px;
		z-index: 2;
		font-family: @bodyFont;
		font-size: 16px;

		background-color: @tourBackground;
		background: -moz-linear-gradient(top, @tourBackground 10%, @backgroundColor 100%); /* FF3.6-15 */
		background: -webkit-linear-gradient(top, @tourBackground 10%,@backgroundColor 100%); /* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(to bottom, @tourBackground 10%,@backgroundColor 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

		&:before {
			display: block;
			top: var(--arrow-position-y-var);
			left: var(--arrow-position-x-var);
			border: solid transparent;
			content: " ";
			height: 0;
			width: 0;
			position: fixed;
			pointer-events: none;
			border-color: rgba(136, 183, 213, 0);
			border-bottom-color: @tourBackground;
			border-width: 20px;
			margin-left: -20px;
		}

		&:not(.in-settings){
			///////////////////////////////
			// custom scrollbars
			///////////////////////////////

			::-webkit-scrollbar {
				width: 5px;
				height: 5px;
			}

			// Track
			::-webkit-scrollbar-track {
				background: mix(@tourBackground, black, 75%);
			}

			// Handle
			::-webkit-scrollbar-thumb {
				-webkit-border-radius: 0px;
				border-radius: 0px;
				background: @outlineColor;
			}
			::-webkit-scrollbar-thumb:window-inactive {
				background: grey;
			}
		}

		&.in-settings{
			z-index: 999999999;
			position: fixed;
			/*border:2px solid red;*/

			@bgFrom: mix(@backgroundColor, black, 80%);
			@bgTo: @backgroundColor;

			color: black;
			background-color: @bgFrom;
			background: -moz-linear-gradient(top, @bgFrom 10%, @bgTo 100%); /* FF3.6-15 */
			background: -webkit-linear-gradient(top, @bgFrom 10%,@bgTo 100%); /* Chrome10-25,Safari5.1-6 */
			background: linear-gradient(to bottom, @bgFrom 10%,@bgTo 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

			&:before{
				top: var(--arrow-position-settings-y-var);
				border-bottom-color: @bgFrom;
			}
		}
	}

	.thought-dialog {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		overflow: auto;
		padding: 10px;
	}

	///////////////////////////////////////////////////////////
	//
	// message
	//
	///////////////////////////////////////////////////////////

	.tour-message{
		margin-bottom: 10px;
	}

	///////////////////////////////////////////////////////////
	//
	// links
	//
	///////////////////////////////////////////////////////////

	a{
		color: @outlineColor;
	}


</style>