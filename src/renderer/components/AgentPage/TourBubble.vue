<template>
	<div class="thought-container animated fadeIn faster"
		 v-bind:class="{ 'in-settings': isSettingsMode }"
			 v-bind:style="{ 'height': message.height + 'px',
							 '--arrow-position-x-var': (message.arrowX) + 'px',
							 '--arrow-position-y-var': (270 - message.height) + 'px',
							 '--arrow-position-settings-y-var': (360 - message.height) + 'px'}"
			 v-if="message">


		<div class="thought-dialog">

			<div class="video-nag" v-if="!haveClickedOnVideoLink && !isSettingsMode">
				<span v-if="!showNagDismiss">
					Before you get started, please watch this
				</span>

				<span v-else>
					Please watch this
				</span>

				<a @click="openLink('https://youtu.be/e_Iuim_uIxQ', $event)" target="_blank">2 minute video on YouTube</a> showing what I can do, it will really help make the rest of the tour make sense.
				<div v-if="showNagDismiss">
					<br />
					<input type="checkbox" id="checkDismiss" v-model="haveCheckedDismiss" />
					<label for="checkDismiss">
						I don't need to see a video, I already know what to do.
					</label>
				</div>
			</div>

			<div class="tour-message" v-html="message.text"></div>



			<button class="button primary"
					@click="onTourNext()">{{ message.buttonLabel || nextStepButtonLabel }}</button>

			<div class="dismiss-container tour"

				 v-if="!isSettingsMode">
				<input type="checkbox" id="checkDismissTour" v-model="haveCheckedDismissEntireTour" />
				<label for="checkDismissTour">
					Dismiss tour, I already know how to search for and create snippets and placeholders.
				</label>
			</div>

			<!--<em v-if="!isSettingsMode">-->
				<!--<br />-->
				<!--Btw you can dismiss this tour at any point by pressing any key (on your keyboard).-->
			<!--</em>-->

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

		data: function () {
			return {
				haveCheckedDismiss: false,
				haveCheckedDismissEntireTour: false,
			}
		},

		computed: mapState({
			haveClickedOnVideoLink: state => state.Tour.haveClickedOnVideoLink,
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
			},
			showNagDismiss: state => {
				return state.Tour.messageIndex >= 2
			}
		}),

		methods: {
			openLink: function(url, event){
				this.$store.commit(tourMutations.HAVE_CLICKED_VIDEO_LINK)

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
		},

		watch: {
			haveCheckedDismiss: function (newValue, oldValue) {
				if(newValue == true){
					this.$store.commit(tourMutations.HAVE_CLICKED_VIDEO_LINK)
				}
			},
			haveCheckedDismissEntireTour: function (newValue, oldValue) {
				if(newValue == true){
					this.$store.commit(tourMutations.CLOSE_TOUR)
				}
			},
		}


	}
</script>

<style lang="less" scoped>
	@import "../../assets/styles/global.less";


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

	///////////////////////////////////////////////////////////
	//
	// nag
	//
	///////////////////////////////////////////////////////////

	.video-nag{
		font-family: @codeFont;
		font-size: 11px;
		font-weight: normal;
		/*font-style: italic;*/
		background-color: rgba(0,0,0,0.5);
		color: white;
		padding: 10px;
		border-radius: 10px;
		position: relative;
		margin-bottom: 10px;
	}

	.dismiss-container{
		position: relative;
		font-family: @codeFont;
		font-size: 11px;
		font-weight: normal;

		&.tour{
			border-top: 1px solid @borderColor;
			margin-top: 40px;
		}
	}

	input{
		margin: 0px;
		margin-right: 10px;
		/*float: left;*/
		position: absolute;
	}

	label{
		margin-top: 10px;
		margin-left: 20px;
		display: inline-block;
		/*float: right;*/
	}

	a{
		color: @linkColor;
	}


</style>