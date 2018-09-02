<template>
	<div class="agent-page">
		<clippy></clippy>

		<!--<speech-bubble></speech-bubble>-->
	</div>

</template>

<script>
	import { analyticsActions } from './../store/types'

	import Clippy from './AgentPage/Clippy'
	// import SpeechBubble from './AgentPage/SpeechBubble'

	export default {
		name: "AgentPage",
		components: {
			'clippy': Clippy,
			// 'speechBubble': SpeechBubble,
		},

		created(){
			this.$store.dispatch(analyticsActions.PAGE_VIEW, ['/agentPage', 'Agent Page'])
		}


	}
</script>

<style>
	body{
		overflow: hidden;
	}

</style>