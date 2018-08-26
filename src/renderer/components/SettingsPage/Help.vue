<template>
	<div class="help-page">
		<p>
			Cyrus is designed to be operated by keyboard
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
			Cyrus supports the use of placeholders in snippets.  A placeholder is a piece of text that is meant to be replaced.  You can provide multiple options for a placeholder and you can free type into the field too.
		</p>



		<h2>
			Further help / feedback
		</h2>

		<p>
			Cyrus was created by me, Gavin Jackson and I would love to hear your thoughts, but if you have any problems PM me on twitter <a @click="openLink('https://twitter.com/gav_jackson', $event)" target="_blank">@gav_jackson</a> and I will do my best to help you.

			You can also check out my website <a @click="openLink('http://www.digital-mojo.com', $event)" target="_blank">www.digital-mojo.com</a>.

		</p>

	</div>
</template>

<script>
	export default {
		name: "Help",

		computed: {
			keys(){
				return this.$store.getters.getShortcutKeys()
			}
		},
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