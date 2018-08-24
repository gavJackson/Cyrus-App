<template>
	<div class="thought-container animated fadeIn"
			 v-bind:style="{ 'height': message.height + 'px',
			  				 '--arrow-position-var': (270 - message.height) + 'px'}"
			 v-if="message">


		<div class="thought-dialog">
			<div class="tour-message"

				 v-html="message.text">


			</div>


			<div class="xdont-show-again-container">
				<button class="button" @click="onTourClose()">Close tour</button>

				<div style="float: right">
					<button class="button primary"
							@click="onTourNext()">Next</button>
				</div>
			</div>
		</div>
	</div>


	<!--</div>-->

</template>

<script>
	import { mapState } from 'vuex'
	import {tourMutations} from '../../store/types'

	export default {
		name: "TourBubble",


		computed: mapState({
			messageIndex: state => state.Tour.messageIndex,
			message: state => {
				return state.Tour.messages[state.Tour.messageIndex]
			}
		}),

		methods: {
			onTourClose(){
				this.$store.commit(tourMutations.CLOSE_TOUR)
			},

			onTourNext(){
				if(this.message){
					this.$store.commit(tourMutations.HIDE_TOUR)

					if(this.message.nextStep){
						this.message.nextStep.call(this)
					}

					setTimeout( () => {
						this.$store.commit(tourMutations.NEXT_STEP)
					}, this.message.delay || 1)
				}

			},

		}
	}
</script>

<style lang="less" scoped>
	@import "../../assets/styles/global.less";

	@tourBackground: mix(@backgroundColor, black, 90%);

	.thought-container {
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 0px;
		display: block;
		height: 230px;
		background-color: @tourBackground;

		&:before {
			display: block;
			top: var(--arrow-position-var);//40px;
			left: 80px;
			border: solid transparent;
			content: " ";
			height: 0;
			width: 0;
			position: fixed;
			pointer-events: none;
			border-color: rgba(136, 183, 213, 0);
			border-bottom-color: @tourBackground;
			border-width: 20px;
			margin-left: -20px;
		}

		// this arrow bit is there, just cannot see it cos its below another arrow thing which is annoying
		&:after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 65%;
			width: 0;
			height: 0;
			border: 26px solid transparent;
			border-top-color: red;//#ffffcd;
			border-bottom: 0;
			border-right: 0;
			margin-left: 40px;
			margin-bottom: -26px;
			/*z-index: 99999;*/
		}
	}

	.thought-dialog {
		/*box-shadow: none;*/

		/*background-color: transparent !important;*/
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		overflow: auto;
		padding: 10px;
	}

	///////////////////////////////////////////////////////////
	//
	// message
	//
	///////////////////////////////////////////////////////////

	.tour-message{
		padding-bottom: 10px;
	}


	///////////////////////////////////////////////////////////
	//
	// dont show again
	//
	///////////////////////////////////////////////////////////

	.dont-show-again-container{
		position: sticky;
		left: 0px;
		top: 230px;
		right: 0px;
		padding: 10px;
		background-color: @tourBackground;
	}



</style>