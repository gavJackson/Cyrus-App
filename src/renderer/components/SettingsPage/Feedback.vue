<template>
	<div class="export-page">
		<h1>Feedback</h1>

		<div v-if="isBETA">
			<h3>BETA Feedback Survey</h3>

			<p>
				Thanks for using the CYRUS beta, we'd love to find out what you think about CYRUS.  Please complete our short survey and you will also qualify for your free copy of CYRUS.
			</p>

			<a @click="onSurveyClicked()"
			   target="_blank" class="button primary">
				<span class="fa fa-bullhorn"></span>&nbsp;Complete survey
			</a>

			<br />
			<br />

			<hr />
		</div>


		<h3>
			Found a bug <span class="far fa fa-bug  fa-fw"></span>
			or
			have a feature request <span class="far fa fa-lightbulb fa-fw"></span> </h3>

		<p>
			If you have a GitHub account it would be great if you could log your issue directly:
		</p>

		<a @click="openLink('https://github.com/gavJackson/Cyrus-App/issues', $event)"
			target="_blank" class="button primary">
			<span class="fa fa-code-branch"></span>&nbsp;Report issue on GitHub
		</a>

		or

		<a @click="openLink('mailto:digital.mojo.gavin@gmail.com?subject=CYRUS: Bug report', $event)"
			target="_blank" class="button">
			<span class="fa fa-envelope"></span>&nbsp;Email us
		</a>

	</div>
</template>

<script>
	import { systemActions } from './../../store/types'
	const shell = require('electron').shell;
	const { app } = require('electron').remote

	export default {
		name: "Feedback",
		data () {
			return {
				showBetaSurveySection: false
			}
		},

		computed: {
			isBETA() {
				return this.$store.state.System.isBETA
			},
		},
		methods: {
			openLink: function(url, event){
				event.preventDefault()

				shell.openExternal(url)
			},

			onSurveyClicked: function(){
				this.$store.dispatch(systemActions.SHOW_BETA_SURVEY)
			},
		},

	}
</script>

<style scoped>

</style>