<template>
	<div class="general-settings-page">
		<h1>General settings</h1>

		<form>
			<div class="field-container">
				<label class="disabled">
					Avatar
				</label>

				Coming soon...
				<!--<select disabled>-->
					<!--<option>Clippy</option>-->
				<!--</select>-->
			</div>

			<div class="field-container">
				<label class="disabled">
					Color Scheme
				</label>

				Coming soon...
				<!--<select disabled>-->
					<!--<option>Yellow</option>-->
				<!--</select>-->
			</div>

			<div class="field-container xcontains-checkbox">
				<label class="disabled">
					Play sounds
				</label>

				Coming soon...
				<!--<input type="checkbox" disabled />-->
			</div>

			<div class="field-container xcontains-checkbox">
				<label class="disabled">
					Menu/Task bar mode
				</label>

				Coming soon...
				<!--<input type="checkbox" disabled />-->
			</div>

			<div class="field-container contains-checkbox">
				<label>
					Encrypt snippets
				</label>

				<input type="checkbox" checked disabled />
			</div>


			<!-- /////////////////////////////////////////////////////////////////

			launch at start up

			///////////////////////////////////////////////////////////////// -->

			<!-- ///////////////////////////////
			OSX (bug in electron, can only turn on!)
			/////////////////////////////// -->


			<div class="field-container contains-checkbox" v-if="isOSX">
				<a class="button block primary" @click="onAutoStartAtLoginClicked">
					Click here to start CYRUS at login
				</a>

				<em>To remove this option you will need to go to your System Preferences (OSX) > Login Items.</em>
			</div>


			<!-- ///////////////////////////////
			Win (can do a normal checkbox)
			/////////////////////////////// -->


			<div class="field-container contains-checkbox" v-else>
				<label for="checkStartUp">
					Launch CYRUS at startup
				</label>

				<input type="checkbox" id="checkStartUp" v-model="launchAtStartUp"/>
			</div>

		</form>


	</div>
</template>

<script>

	import { systemMutations } from './../../store/types'
	import is from 'electron-is'


	export default {
		name: "GeneralSettings",

		data: function () {
			return {
				launchAtStartUp: false,
				isOSX: false
			}
		},

		computed: {
			launchCyrusAtStartup(){
				return this.$store.state.System.launchCyrusAtStartup
			}

		},

		methods: {
			onAutoStartAtLoginClicked(){
				this.launchAtStartUp = true
			}
		},

		mounted: function() {
			this.launchAtStartUp = this.launchCyrusAtStartup

			// need to detect OS because there is a bug in Electron, where we
			// cannot remove from the login items
			this.isOSX = is.macOS()
		},

		watch: {
			launchAtStartUp: function (newValue) {
				this.$store.commit(systemMutations.SETTING_CHANGE_LAUNCH_AT_START_UP, newValue)
			}
		}
	}
</script>

<style lang="less" scoped>
	.field-container{
		position: relative;
		display: block;
		padding-top: 10px;
		padding-bottom: 10px;

		label{
			padding-left: 30px;
			width: 200px;
			display: inline-block;
			float: none;
			clear: both;
		}

		.button, em{
			margin-top: 30px;
			margin-right: 40px;
			display: block;
			margin-left: 30px;

		}

		&.contains-checkbox{
			padding: 0px;
			input{
				margin: 0px;
			}
			label{
				position: relative;
				top: -10px;
				margin-left: 0px;
			}

		}
	}


</style>