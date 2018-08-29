<template>
	<div class="agent-page">
		<clippy></clippy>

		<!--<speech-bubble></speech-bubble>-->
	</div>

</template>

<script>

	import Clippy from './AgentPage/Clippy'
	// import SpeechBubble from './AgentPage/SpeechBubble'

	export default {
		name: "AgentPage",
		components: {
			'clippy': Clippy,
			// 'speechBubble': SpeechBubble,
		},

		// created(){
		// 	debugger
		// }


	}
</script>

<style>
	body{
		overflow: hidden;
	}

</style>