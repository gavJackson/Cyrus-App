<template>
	<!--<div class="speech-bubble dialog xanimated xbounceIn"-->
		 <!--v-if="appHasFocus">-->

	<div class="speech-bubble dialog tought">
		TODO show help in here

		<div class="tour-message"

			 v-html="message">


		</div>


		<div class="dont-show-again-container">
			<input type="checkbox" id="checkDontShowAgain" />

			<label for="checkDontShowAgain">
				Close tour and don't show again
			</label>
		</div>
	</div>


	<!--</div>-->

</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: "TourBubble",


		computed: mapState({
			messageIndex: state => state.Tour.messageIndex,
			message: state => state.Tour.getCurrentMessage(),
		}),

		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.speech-bubble {
		box-shadow: none;

		border: none;
		width: 300px;
		height: 230px;
		position: absolute;
		right: 0px;
		bottom: 0px;
		overflow: visible;

		&.show{
			display: block;
		}
	}


	///////////////////////////////////////////////////////////
	//
	// dont show again
	//
	///////////////////////////////////////////////////////////

	.dont-show-again-container{
		position: absolute;
		left: 0px;
		bottom: 0px;
		padding: 10px;

		input{
			height: auto;
		}

		label{
			top: 2px;
			position: relative;
		}

	}



</style>