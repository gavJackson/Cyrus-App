<template>
	<div class="help-page">
		<p>
			Cyrus is designed to be operated by keyboard.  <a @click="openLink('https://youtu.be/Mf8PFIL-4cQ', $event)" target="_blank">Watch the intro video on YouTube</a>
		</p>

		<h2>
			Activation {{ keys }}
		</h2>

		<p>
			Use the activation short cut keys {{ keys }} to open Cyrus, this works from any other application and will bring Cyrus to the front, ready to accept your commands.
		</p>

		<h2>Searching</h2>

		<p>You can search either by term, or you can use CAPITAL LETTERS which will search for the first letters.  For example if you want to Create a New Snippet, you could type <code>CNS</code> or even <code>CN</code></p>


		<h2>Scrolling through results</h2>

		<p>
			When you are searching, you can use the UP and DOWN arrow keys to move through the results and the ENTER key to select a snippet.
		</p>

		<h2>Placeholders</h2>

		<p>
			Cyrus supports the use of placeholders in snippets.  A placeholder is a piece of text that is meant to be replaced.  You can provide multiple options for a placeholder and you can free type into the field too.<br /><br />Wrap any word in your snippet with `%` to define it as a placeholder, this will make the placeholders tab available where you can add options for each placeholder.
		</p>


		<h2>Tags</h2>

		<p>
			Tags are an optional way to organise your snippets, for example if you had a snippet called `My email address` you might want to use the tag `personal`.<br /><br />You can also use tags to quickly find your snippets in settings mode, or even when searching, so if you wanted to find all the snippets with a certain tag you can use a colon.  So searching for `personal:` would show all snippets with the personal tag, and you can even perform searches within a tag, e.g. `personal: address` would find all snippets with the `personal` tag that contained the word `address`.
		</p>



		<h2>
			Further help / feedback
		</h2>

		<p>
			Cyrus was created by me, Gavin Jackson and I would love to hear your thoughts, but if you have any problems, questions or suggestions for improvements please email me <a @click="openLink('mailto:digital.mojo.gavin@gmail.com?subject=I need help with CYRUS', $event)" target="_blank">digital.mojo.gavin@gmail.com</a> and I will do my best to help you.

			<br /><br />

			You can also check out my website <a @click="openLink('http://www.digital-mojo.com', $event)" target="_blank">www.digital-mojo.com</a>.

		</p>

	</div>
</template>

<script>
	const shell = require('electron').shell;

	export default {
		name: "Help",

		computed: {
			keys(){
				return this.$store.getters.getShortcutKeys()
			}
		},

		methods: {
			openLink: function (url, event) {
				event.preventDefault()

				shell.openExternal(url)

			},
		}
	}
</script>

<style lang="less" scoped>
	.help-page{
		overflow: auto;
		position: absolute;
		left: 0px;
		right: 0px;
		top: 10px;
		bottom: 0px;
		padding: 20px;
		padding-top: 0px;
	}

</style>