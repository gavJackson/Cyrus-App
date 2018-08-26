<template>
	<div>
		<div v-if="isTourRunning">
			<div class="speech-bubble dialog running-tour">
				<div class="warning">Playing tour</div>

				<autoComplete class="user-input auto-complete"/>

				<tourBubble v-if="showTour" />
			</div>
		</div>

		<div v-else>
			<div class="speech-bubble dialog"

				 v-if="showSpeechBubble">

				<autoComplete class="user-input auto-complete"/>

				<tourBubble v-if="showTour" />
			</div>
		</div>
	</div>
</template>

<script>
	import AutoComplete from '../AgentPage/AutoComplete'
	import TourBubble from '../AgentPage/TourBubble'
	import { mapState } from 'vuex'

	export default {
		name: "SpeechBubble",

		components: {
			'autoComplete': AutoComplete,
			'tourBubble': TourBubble,
		},

		computed: mapState({
			appHasFocus: state => state.Focus.appHasFocus,
			showTour: state => state.Tour.showTour,
			isTourRunning: state => state.Tour.isTourRunning,
			showSpeechBubble: state => {
				return state.Focus.appHasFocus || state.Tour.isTourRunning
			}
		}),
	}
</script>

<style lang="less" scoped>
	.warning{
		border-radius: 5px;
		position: absolute;
		bottom: 10px;
		left: 10px;
		font-weight: bold;
		color: black;
		background-color: white;
		border: 2px solid black;
		font-family: "Hack";
		font-size: 11px;
		text-transform: uppercase;
		padding: 5px;
		z-index: 1;

		&:before{
			content: '▶';
			margin-right: 5px;
		}
	}

	.speech-bubble {
		/*display: none;*/

		width: 300px;
		height: 270px;
		position: absolute;
		/*left: 40px;*/
		right: 60px;
		bottom: 90px;
		overflow: visible;

		&.show{
			display: block;
			box-shadow: 3px 10px 24px 3px rgba(0, 0, 0, 0.25);
		}

		&:after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 65%;
			width: 0;
			height: 0;
			border: 26px solid transparent;
			border-top-color: #ffffcd;
			border-bottom: 0;
			border-right: 0;
			margin-left: 40px;
			margin-bottom: -26px;
		}

		&:focus{
			outline: none;
		}

		&.running-tour{
			.auto-complete{
				pointer-events: none;

				*{

					pointer-events: none;
				}
			}
		}
	}



	.user-input {
		margin-top: 10px;
		background: transparent;
		border: none;
		font-size: 20px;
		width: 100%;
		display: block;
		position: absolute;
		left: 0px;
		right: 0px;
		top: -10px;
		bottom: 0px;
		padding: 10px;
		box-sizing: border-box;
		font-size: 14px;
	}

	.user-input:focus {
		outline: none;
	}

</style>