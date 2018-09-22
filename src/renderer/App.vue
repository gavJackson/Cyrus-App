<template>
	<div id="app" v-bind:class="{ 'is-win': !isMac,
	 							  'is-mac': isMac }">
		<router-view></router-view>
	</div>
</template>

<script>
	import {focusMutations, snippetsActions, analyticsActions, systemActions} from './store/types'
	import is from 'electron-is'
	const { app, dialog } = require('electron').remote;
	const shell = require('electron').shell;


	export default {
		name: 'clippy',


		data (){
			return {
				isMac: false,
			}
		},

		created: function () {
			window.addEventListener('focus', this.onFocus);
			window.addEventListener('blur', this.onBlur);
            window.addEventListener('click', this.onClick);


			this.isMac = is.macOS()

			this.$store.dispatch(snippetsActions.LOAD)
			this.$store.dispatch(systemActions.INIT)
			this.$store.dispatch(analyticsActions.PAGE_VIEW, ['/created', 'App created'])


		},

		destroyed: function () {
			window.removeEventListener('focus', this.onFocus);
			window.removeEventListener('blur', this.onBlur);
            window.removeEventListener('click', this.onClick);

		},

		methods: {

			///////////////////////////////////////////////////////////
			//
			// handlers
			//
			///////////////////////////////////////////////////////////

            onClick(){
				window.focus()
			},

			onFocus() {
				this.$store.commit(focusMutations.APP_FOCUS)
			},

			onBlur() {
				this.$store.commit(focusMutations.APP_BLUR)
			},
		},
	}

	///////////////////////////////////////////////////////////
	//
	// Enabling copy and paste into input fields via context menu
	//
	///////////////////////////////////////////////////////////

	const electron = require('electron');
	const remote = electron.remote;
	const Menu = remote.Menu;

	const InputMenu = Menu.buildFromTemplate([{
		label: 'Undo',
		role: 'undo',
	}, {
		label: 'Redo',
		role: 'redo',
	}, {
		type: 'separator',
	}, {
		label: 'Cut',
		role: 'cut',
	}, {
		label: 'Copy',
		role: 'copy',
	}, {
		label: 'Paste',
		role: 'paste',
	}, {
		type: 'separator',
	}, {
		label: 'Select all',
		role: 'selectall',
	},
	]);

	document.body.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		e.stopPropagation();

		let node = e.target;

		while (node) {
			if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
				InputMenu.popup(remote.getCurrentWindow());
				break;
			}
			node = node.parentNode;
		}
	});



</script>

<style lang="less">

	@import "assets/fonts/fontAwesome/css/all.min.css";
	@import "assets/styles/animate.less";
	@import "assets/styles/global.less";

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
				background: fade(@outlineColor, 60%);
			}

			///////////////////////////////
			// inputs
			///////////////////////////////

			input, select, textarea, .vue-input-tag-wrapper {
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

				& + label {
					transition: all 0.25s ease-in-out;
					opacity: 0.7;
					position: absolute;
					float: right;
					display: block;
					margin-top: -34px;
					margin-left: 10px;
				}
			}

			input[type=checkbox]{
				padding: 0px;
				margin: 0px;
			}

			input:not([type=submit]):not([type=checkbox]), select, textarea, .vue-input-tag-wrapper {
				&:focus {
					background-color: darken(@codeBackground, 10%);

					padding-left: 5px;
					& + label {
						opacity: 0;
					}
				}



				&:empty {

				}

				&:disabled{
					opacity: 0.4;
					background-color: lighten(@codeBackground, 5%);
					color: lighten(@codeBackground, 40%);
					border-color: lighten(@codeBackground, 10%);
				}
			}

			label.disabled{
				opacity: 0.4;
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
					background-color: transparent;

					&:focus {
						background-color: transparent !important;
					}
				}
				.new-tag{
					color: white;
					background-color: transparent;
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

	.placeholders-container{
		.vue-input-tag-wrapper .input-tag,

		.tag{
			background-color: mix(@primaryButtonColor, cyan, 20%);
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

	hr{
		border-bottom: 1px solid @borderColor;
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
		transition: all 0.25s ease-in-out;

		display: inline-block;
		cursor: pointer;
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
		border-radius: 3px;
		padding: 8px 10px;
		font-size: 12px;
		border: none;
		font-weight: normal;
		min-width: 60px;
		text-align: center !important;

		background-color: @buttonColor;
		color: @buttonTextColor;
		font-family: @codeFont;
		text-decoration: none;

		&:hover, &:focus {
			background-color: lighten(@buttonColor, 30%);
			text-decoration: none;
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
				background-color: mix(@primaryButtonColor, cyan, 50%);
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
			padding: 2px 1px;
			margin-left: 5px;
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
		background-color: fade(@codeBackground, 80%);
		color: @codeText;
		width: 300px;
		height: 175px;
		font-family: @codeFont;
		font-size: 14px;
		white-space: pre;
		tab-size: 2;
		overflow: auto;
		z-index: 3;
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

	///////////////////////////////
	// utils
	///////////////////////////////

	.bottom-gradient{
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 50px;
		background-color: transparent;
		background: -webkit-linear-gradient(top, fade(@backgroundColor, 0%) 20%, @backgroundColor 90%); /* Chrome10-25,Safari5.1-6 */
		z-index: 1;
		pointer-events: none;
	}

	///////////////////////////////////////////////////////////
	//
	// windows specific changes (due to rubbish rendering)
	//
	///////////////////////////////////////////////////////////

	/*.is-mac{*/
	.is-win{
		// corrects the weird padding which changes the y position of text
		.highlight:not(.capital-letter) {
			padding: 0px;
			margin: 0px;
			display: inline;
		}

		// moves the arrow in the tour bubble down a bit as its high for some reason
		.thought-container {
			&:before{
				margin-top: 0px;
			}
		}


		// introducing custom scrollbars everywhere as the default windows ones are horrible

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

		.autocomplete-result{
			margin-right: 5px;
		}
	}


	// fixing drag issues
	a,
	input,
	select,
	button,
	textarea {
		-webkit-app-region: no-drag;
	}

</style>
