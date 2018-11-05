<template>
	<div class="agent-page">
		<clippy></clippy>
	</div>

</template>

<script>
	import { analyticsActions } from './../store/types'

	import Clippy from './AgentPage/Clippy'

	export default {
		name: "AgentPage",
		components: {
			'clippy': Clippy,
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