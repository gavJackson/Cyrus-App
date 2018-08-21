<template>
	<div id="app">
		<router-view></router-view>

		<v-tour name="myTour" :steps="steps" :callbacks="myCallbacks" :options="myOptions">
			<template slot-scope="tour">
				<transition name="fade">
					<v-step
							v-if="tour.currentStep === index"
							v-for="(step, index) of tour.steps"
							:key="index"
							:step="step"
							:previous-step="tour.previousStep"
							:next-step="tour.nextStep"
							:stop="tour.stop"
							:isFirst="tour.isFirst"
							:isLast="tour.isLast"
					>
						<template v-if="tour.currentStep === 1">
							<div slot="actions">
								<button @click="tour.previousStep"
										class="btn btn-primary">Previous step
								</button>
								<button @click="doSecondStep(tour)"
										class="btn btn-primary">Next step
								</button>
							</div>
						</template>
					</v-step>
				</transition>
			</template>
		</v-tour>
	</div>
</template>

<script>
	import {focusMutations, snippetsMutations} from './store/types'

	// TODO look at http://linkedin.github.io/hopscotch/ as it looks like it has more options
	export default {
		name: 'clippy',

		data() {
			return {
				myCallbacks: {
					onPreviousStep: this.onPreviousStepCallback,
					onNextStep: this.onNextStepCallback
				},
				myOptions: {
					useKeyboardNavigation: true
				},
				steps: [
					{
						target: '#agentImage',  // We're using document.querySelector() under the hood
						content: `Hi there, I'm <strong>Clippy</strong>! (name tbc) - Click 'Next' to begin the tour and find out how I can help you work smarter with live templates.`,
						params: {
							placement: 'top'
						}
					},
					{
						target: '#inputSearch',
						content: 'This is the search field.  You can either search for your live templates here, to get you started I have added some examples.  Lets search for an `example`'
					},
					{
						target: '#autoCompleteResults li:nth-child(2)',
						content: 'Your results are shown here, you can use your up and down arrow keys to select which one, for now lets go with the first result. Select the first item and hit ENTER',
						params: {
							placement: 'bottom',
							delay: 2000
						}
					},
					{
						target: '#inputSearch',
						content: 'Now lets have xxxxa look at the other example which has placeholders.  Lets search for `Example with placeholders`',
						params: {
							placement: 'bottom',
							delay: 2000
						}
					},
				]
			}
		},

		mounted: function () {
			// this.$tours['myTour'].start()
		},

		created: function () {
			window.addEventListener('focus', this.onFocus);
			window.addEventListener('blur', this.onBlur);


			this.$store.commit(snippetsMutations.LOAD)
		},


		destroyed: function () {
			window.removeEventListener('focus', this.onFocus);
			window.removeEventListener('blur', this.onBlur);

		},

		methods: {

			///////////////////////////////////////////////////////////
			//
			// handlers
			//
			///////////////////////////////////////////////////////////

			onFocus() {
				this.$store.commit(focusMutations.APP_FOCUS)
			},

			onBlur() {
				this.$store.commit(focusMutations.APP_BLUR)
			},

			onPreviousStepCallback(currentStep){
				debugger

			},
			onNextStepCallback(currentStep){
				switch(currentStep){
					case 0:
						this.onFirstStep()
						break
					case 1:
						this.onSecondStep()
						break
				}
			},

			///////////////////////////////////////////////////////////
			//
			// custom step actions
			//
			///////////////////////////////////////////////////////////

			onFirstStep() {
				this.onFocus();

				document.getElementById('agentImage').click()
			},

			onSecondStep() {
				this.onFocus();

				var el = document.getElementById('inputSearch');
				el.value='example'
				setTimeout ( () => el.dispatchEvent(new Event('input')), 100);
			},

			///////////////////////////////////////////////////////////
			//
			// tour helps
			//
			///////////////////////////////////////////////////////////

			doSecondStep(tour) {
				this.onSecondStep()

				setTimeout ( () => tour.nextStep(), 1100);

			}

		}
	}
</script>

<style lang="less">
	@import "assets/fonts/fontAwesome/css/all.css";
	@import "assets/styles/animate.less";
	/*@import "./../libs/hopscotch/css/hopscotch.css";*/

	///////////////////////////////////////////////////////////
	//
	// mixins
	//
	///////////////////////////////////////////////////////////

	.gradient(@color: #F5F5F5, @start: #EEE, @stop: #FFF) {
		background: @color;
		background: -webkit-gradient(linear,
		left bottom,
		left top,
		color-stop(0, @start),
		color-stop(1, @stop));
		background: -ms-linear-gradient(bottom,
		@start,
		@stop);
		background: -moz-linear-gradient(center bottom,
		@start 0%,
		@stop 100%);

		filter: ~"progid:DXImageTransform.Microsoft.gradient( startColorstr='@{stop}', endColorstr='@{start}',GradientType=0 )";
		background: linear-gradient(top, @start 1%, @stop 100%);
	}

	///////////////////////////////////////////////////////////
	//
	// variables
	//
	///////////////////////////////////////////////////////////

	@highlightColor: yellow;
	@linkColor: @highlightColor;
	@textColor: black;
	@backgroundColor: #ffffcd;
	@borderColor: #94944c;
	@bodyFont: 'Comic Neue Regular', "Comic Sans MS", Arial, "Helvetica Neue", Helvetica, sans-serif;
	@codeFont: "Hack", "mono";
	@inputFont: "Hack", Arial, "Helvetica Neue", Helvetica, sans-serif;
	@outlineColor: darkCyan;
	@codeBackground: #404040;
	@codeText: white;
	@invalidColor: darken(red, 10%);

	@buttonColor: @textColor;
	@buttonTextColor: #ffffff;
	@primaryButtonColor: @linkColor;
	@primarybuttonTextColor: @textColor;

	///////////////////////////////////////////////////////////
	//
	// fonts
	//
	///////////////////////////////////////////////////////////

	@font-face {
		font-family: 'Comic Neue Regular';
		font-style: normal;
		font-weight: normal;
		src: url("assets/fonts/ComicNeue/ComicNeue-Regular.eot");
		src: url("assets/fonts/ComicNeue/ComicNeue-Regular.eot?#iefix") format("embedded-opentype"),
		url("assets/fonts/ComicNeue/ComicNeue-Regular.woff2") format("woff2"),
		url("assets/fonts/ComicNeue/ComicNeue-Regular.woff") format("woff"),
		url("assets/fonts/ComicNeue/ComicNeue-Regular.ttf") format("truetype");

	}

	@font-face {
		font-family: 'Comic Neue Regular';
		font-style: normal;
		font-weight: bold;
		src: url("assets/fonts/ComicNeue/ComicNeue-Bold.eot");
		src: url("assets/fonts/ComicNeue/ComicNeue-Bold.eot?#iefix") format("embedded-opentype"),
		url("assets/fonts/ComicNeue/ComicNeue-Bold.woff2") format("woff2"),
		url("assets/fonts/ComicNeue/ComicNeue-Bold.woff") format("woff"),
		url("assets/fonts/ComicNeue/ComicNeue-Bold.ttf") format("truetype");

	}

	@font-face {
		font-family: 'Hack';
		font-style: normal;
		font-weight: normal;
		src: url("assets/fonts/Hack/Hack-Regular.ttf") format("truetype");
	}

	@font-face {
		font-family: 'Hack';
		font-style: normal;
		font-weight: bold;
		src: url("assets/fonts/Hack/Hack-Bold.ttf") format("truetype");

	}

	.body-font {
		font-family: @bodyFont;
	}

	body {
		color: @textColor;
		font-family: @bodyFont;

		///////////////////////////////////////////////////////////
		//
		// settings mode is `codey`
		//
		///////////////////////////////////////////////////////////

		.settings-mode {
			.gradient(@codeBackground, @codeBackground, darken(@codeBackground, 10%));

			background-color: @codeBackground;
			border: 1px solid darken(@codeBackground, 10%);
			color: @codeText;
			font-family: @codeFont;
			font-size: 12px;

			///////////////////////////////
			// custom scrollbars
			///////////////////////////////

			::-webkit-scrollbar {
				width: 5px;
				height: 5px;
			}

			// Track
			::-webkit-scrollbar-track {
				background: black; //lighten(black, 20%);
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

			///////////////////////////////
			// inputs
			///////////////////////////////

			input:not([type=submit]), select, textarea, .vue-input-tag-wrapper {
				box-sizing: border-box;
				border-radius: 4px;
				padding: 3px 5px;
				font-size: 12px;
				margin-bottom: 10px;
				border: 2px solid lighten(@codeBackground, 20%);
				background-color: transparent;
				color: @codeText;
				padding-left: 50px;
				transition: all 0.25s ease-in-out;

				&:focus {
					background-color: darken(@codeBackground, 10%);

					padding-left: 5px;
					& + label {
						opacity: 0;
					}
				}

				& + label {
					transition: all 0.25s ease-in-out;
					opacity: 0.7;
					position: absolute;
					float: right;
					display: block;
					margin-top: -34px;
					margin-left: 10px;
				}

				&:empty {

				}
			}

			.vue-input-tag-wrapper {
				/*border: none;*/
				padding: 0px;
				padding-left: 5px;
				font-size: 13px;
				overflow: auto;
				display: block;
				margin-bottom: 0px;
				white-space: nowrap;
				-webkit-appearance: none;

				input {
					border: none;
					padding-left: 5px;
					margin: 0px;

					&:focus {
						background-color: transparent;
					}
				}

				& + label {
				}
			}

			::selection {
				background: fade(@highlightColor, 30%); /* WebKit/Blink Browsers */
			}
			::-moz-selection {
				background: #ffb7b7; /* Gecko Browsers */
			}

			.tab-pane {
				background-color: @buttonColor;
			}
		}
	}

	///////////////////////////////
	// tags
	///////////////////////////////

	.settings-mode .vue-input-tag-wrapper .input-tag,
	.tag {
		transition: all 0.25s ease-in-out;
		border-radius: 3px;
		color: @primarybuttonTextColor;
		background-color: mix(@primaryButtonColor, @outlineColor);
		border: none;
		display: inline-block;
		padding: 3px 5px;
		margin-right: 3px;
		font-weight: normal;

		.remove {
			color: @primarybuttonTextColor;
		}

		&.in-active {
			background-color: rgba(255, 255, 255, 0.5);
		}
	}

	input {
		font-family: @inputFont;
	}

	.code {
		font-family: @codeFont;
		color: @codeText;
	}

	.body {
		color: @textColor;
	}

	///////////////////////////////////////////////////////////
	//
	// global styles
	//
	///////////////////////////////////////////////////////////

	#app {
		overflow: hidden;
	}

	///////////////////////////////
	// links / buttons / tabs
	///////////////////////////////

	a {
		cursor: pointer;
		color: @linkColor;
		text-decoration: none;
		box-sizing: border-box;
		font-weight: bold;

		&:hover {
			text-decoration: underline;
		}

		&.not-a-link {
			cursor: default;
			color: @codeText;
			font-weight: normal;

			&:hover {
				text-decoration: none;
			}
		}
	}

	a, button, .button {
		&:focus {
			outline: 2px solid @outlineColor;
		}
	}

	button, .button, input[type=submit] {
		cursor: pointer;
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
		border-radius: 3px;
		padding: 8px 10px;
		font-size: 12px;
		border: none;
		font-weight: normal;
		min-width: 60px;

		background-color: @buttonColor;
		color: @buttonTextColor;
		font-family: @codeFont;

		&:hover, &:focus {
			background-color: lighten(@buttonColor, 30%);
		}

		&.in-active {
			background-color: lighten(@buttonColor, 20%);

			&:hover {
				background-color: lighten(@buttonColor, 30%);
			}
		}

		&.small {
			padding: 3px 5px;
			font-size: 10px;
		}

		&.selected {
			background-color: @buttonColor;

			&:hover, &:focus {
				background-color: @buttonColor;
			}
		}

		/*
		THIS BREAKS BUTTONS IN VUE.JS!!!
		&:active{
			background-color: @primaryButtonColor;
			color: @primarybuttonTextColor;
			pointer-events: none;
		}
		*/

		&.primary {
			min-width: 90px;
			background-color: @primaryButtonColor;
			color: @primarybuttonTextColor;

			&:hover, &:focus {
				background-color: lighten(@primaryButtonColor, 20%);
			}

			&:disabled {
				background-color: red;
				cursor: not-allowed;
			}
		}
	}

	///////////////////////////////
	// helper classes
	///////////////////////////////

	.bottom-bordered {
		border-bottom: 1px solid @borderColor;
	}

	.top-bordered {
		border-top: 1px solid @borderColor;
	}

	.dialog {
		box-shadow: 10px 11px 35px 4px rgba(0, 0, 0, 0.56);

		border-radius: 5px;
		background-color: @backgroundColor;
		border: 1px solid @borderColor;
		padding: 10px;
	}

	///////////////////////////////
	// placeholder
	///////////////////////////////

	.placeholder-being-replaced, highlight {
		border: 1px solid white;
		background-color: #000000;
		font-weight: bold;
		color: #ffffff;
		padding: 2px 5px;
		margin-top: -5px;
		margin-left: -2px;
		display: inline-block;
	}

	.highlight {
		background-color: fade(@highlightColor, 35%);
		display: inline-block;
		padding: 2px 1px;
		margin-left: -2px;
		margin-top: -5px;

		&.search-term {

		}

		&.capital-letter {
			background-color: fade(@highlightColor, 50%);
			border: 1px solid darken(@highlightColor, 10%);
			margin-left: 2px;
		}
	}

	///////////////////////////////
	// preview
	///////////////////////////////

	.preview {
		border-radius: 5px;
		padding: 10px;
		box-sizing: border-box;
		margin-top: 10px;
		background-color: @codeBackground;
		color: @codeText;
		width: 300px;
		height: 175px;
		font-family: @codeFont;
		font-size: 14px;
		white-space: pre;
		tab-size: 2;
		overflow: auto;
	}

	.preview.enable-wrap {
		white-space: pre-wrap;
	}

	///////////////////////////////
	// form inputs
	///////////////////////////////

	input, select, textarea {
		box-sizing: border-box;
		border-radius: 4px;
		padding: 3px 5px;
		font-size: 12px;
		margin-bottom: 10px;
		height: 35px;
		display: inline-block;
		color: @textColor;
		tab-size: 2;

		&:focus {
			outline: 2px solid @outlineColor;
		}
	}

	form.is-dirty {
		input:not([type=submit]), select, textarea {
			&.invalid {
				color: @invalidColor;
				border-color: @invalidColor;

				&:focus {
					outline: 2px solid @invalidColor;
				}
			}
		}

		.snippet.invalid {
			outline: 2px solid red;
		}
	}

	form:not(.is-dirty) {
		.message.validation {
			visibility: hidden;
			background-color: green;
		}
	}

	///////////////////////////////
	// messages
	///////////////////////////////

	.message {
		font-size: 11px;
		border-radius: 20px;
		display: block;
		margin: 0px auto;
		position: absolute;
		left: 0px;
		right: 0px;
		width: 300px;
		background-color: fade(@primaryButtonColor, 80%);
		bottom: 30px;
		color: @primarybuttonTextColor;
		text-align: center;
		padding: 10px;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&.validation {
			background-color: darken(@invalidColor, 10%);
		}
	}

</style>
