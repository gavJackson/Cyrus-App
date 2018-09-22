<template>
	<div class="about-page">
		<h1>About CYRUS</h1>

		<p>
			CYRUS is a Windows and OSX desktop app built using Electron and VueJS. CYRUS is a productivity tool and provides quick and easy access to snippets and templates which you can paste into any application. CYRUS can be controlled entirely by keyboard and can be used to provide you with easy access to simple snippets or for more complex templates with placeholder replacements. All of this ends up in your clip board, ready to paste into any application.
		</p>

		<img class="mojo-logo"
			 src="static/images/DigitalMojoLogo.png"/>

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
				<td class="value"><a @click="openLink('http://www.digital-mojo.com/cyrus', $event)" target="_blank">digital-mojo.com</a></td>
			</tr>
			<tr>
				<td class="info">YouTube</td>
				<td class="value"><a @click="openLink('https://www.youtube.com/channel/UC8B9Bb2RQEC1kgwZXtrO8Sg', $event)" target="_blank">Digital Mojo</a></td>
			</tr>
			<tr>
				<td class="info">Email</td>
				<td class="value"><a @click="openLink('mailto:digital.mojo.gavin@gmail.com?subject=CYRUS: About', $event)" target="_blank">digital.mojo.gavin@gmail.com</a></td>
			</tr>
			<tr>
				<td class="info">Encryption</td>
				<td class="value">

                    <span v-html="encryptionStatus">...</span>
                    <a @click="onEncryptionStatusClicked">
                        <!--[<span class="fa fa-info-circle"></span>&nbsp;About]-->
                        <!--<span class="fa fa-info-circle"></span>-->
                        (info)
                    </a>
                </td>
			</tr>
			<!--<tr>-->
				<!--<td class="info">Source</td>-->
				<!--<td class="value"><a @click="openLink('https://github.com/gavJackson/Cyrus-App', $event)" target="_blank">github.com</a></td>-->
			<!--</tr>-->
		</table>
	</div>


</template>

<script>
	const { app, dialog } = require('electron').remote;
	const shell = require('electron').shell;
	import { mapState } from 'vuex'

	export default {
		name: "About",

		data: function () {
			return {
				versionNumber: "",
				name: "",
			}
		},

		computed: mapState({
			encryptionStatus: state => state.Snippets.encrypt == true ? '<span style="color: lightgreen"><span class="fa fa-check-circle"></span>&nbsp;On' : '<span style="color: orangered"><span class="fa fa-times-circle"></span>&nbsp;Off</span>',
		}),

		methods: {
			openLink: function(url, event){
				event.preventDefault()

				shell.openExternal(url)

			},

			onEncryptionStatusClicked: function(){
				let message = `When encryption is turned on, CYRUS encyrpts your snippets before writing them to disk.  This is especially important if you are using CYRUS to store sensitive snippets such as passwords or ID numbers however we do not recommend you store credit card numbers with CYRUS and if you do keep sensitive information in CYRUS, please be especially careful when exporting your snippets to share with friends!`
				const dialogOptions = {type: 'info', buttons: ['OK'], message: message}

				dialog.showMessageBox(dialogOptions, i => {
					if(i == 0){	// ok button
						// do nothing
					}
				})
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
		opacity: 0.5;
		width: 60px;
		text-align: right;
		padding-right: 10px;
		//text-transform: uppercase;

		&:after{
			content: ':';
		}
	}

	.mojo-logo{
		float: right;
		position: absolute;
		right: 10px;
		margin-top: -15px;
	}

</style>