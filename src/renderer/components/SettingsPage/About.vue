<template>
	<div class="about-page">
		<h1>About Cyrus</h1>

		<p>
			Cyrus is a Windows and OSX desktop app built using Electron and VueJS. Cyrus is a productivity tool and provides quick and easy access to snippets and templates which you can paste into any application. Cyrus can be controlled entirely by keyboard and can be used to provide you with easy access to simple snippets or for more complex templates with placeholder replacements. All of this ends up in your clip board, ready to paste into any application.
		</p>

		<img class="mojo-logo"
			 src="~@/assets/images/DigitalMojoLogo.png"/>

		<table>
			<tr>
				<td class="info">Version</td>
				<td class="value">{{ name }} {{ versionNumber }}</td>
			</tr>
			<tr>
				<td class="info">Created</td>
				<td class="value">August 2018</td>
			</tr>
			<tr>
				<td class="info">Author</td>
				<td class="value">Gavin Jackson</td>
			</tr>
			<tr>
				<td class="info">Twitter</td>
				<td class="value"><a @click="openLink('https://twitter.com/gav_jackson', $event)" target="_blank">@gav_jackson</a></td>
			</tr>
			<tr>
				<td class="info">Website</td>
				<td class="value"><a @click="openLink('http://www.digital-mojo.com', $event)" target="_blank">www.digital-mojo.com</a></td>
			</tr>
			<!--<tr>-->
				<!--<td class="info">Source</td>-->
				<!--<td class="value"><a @click="openLink('https://github.com/gavJackson/Cyrus-App', $event)" target="_blank">github.com</a></td>-->
			<!--</tr>-->
		</table>
	</div>


</template>

<script>
	const {app} = require('electron').remote;
	const shell = require('electron').shell;

	export default {
		name: "About",

		data: function () {
			return {
				versionNumber: "",
				name: "",
			}
		},

		methods: {
			openLink: function(url, event){
				event.preventDefault()

				shell.openExternal(url)

			}
		},

		created: function() {
			this.versionNumber = app.getVersion()
			this.name = app.getName()
		},
	}
</script>

<style lang="less" scoped>
	.value{

	}

	.info{
		width: 80px;
		text-align: left;
		padding-right: 20px;

		&:after{
			content: ':';
		}
	}

	.mojo-logo{
		float: right;
	}

</style>