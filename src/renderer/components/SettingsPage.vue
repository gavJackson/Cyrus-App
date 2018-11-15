<template>
	<div class="settings-mode dialog"
		 v-bind:class="{ 'is-tour-running': showTour }">
		<a class="close not-a-link" href="#/agent" ><span class="fa fa-times-circle"></span></a>

		<ul class="breadcrumbs">
			<li class="crumb">
				<a href="#/agent" tabindex="0">CYRUS</a>
			</li>

			<li class="crumb"
				v-for="(breadcrumb, idx) in breadcrumbList"
			   :key="idx"
			   @click="routeTo(idx)">

				<a tabindex="0" :class="{'not-a-link': !breadcrumb.link}">{{ breadcrumb.name}}</a>
			</li>

		</ul>

		<router-view class="router-view"></router-view>

		<tourBubble class="tour-bubble" isSettingsMode="true"

					v-if="showTour" />
	</div>
</template>

<script>
	import TourBubble from './AgentPage/TourBubble'
	import { mapState } from 'vuex'
	import { tourMutations, analyticsActions } from '../store/types'

	export default {
		name: "SettingsPage",

		components: {
			'tourBubble': TourBubble,
		},

		data (){
			return {
				breadcrumbList: []
			}
		},

		computed: mapState({
			appHasFocus: state => state.Focus.appHasFocus,
			showTour: state => state.Tour.showTour,
			isTourRunning: state => state.Tour.isTourRunning,
			messageIndex: state => state.Tour.messageIndex,
			showSpeechBubble: state => {
				return state.Focus.appHasFocus || state.Tour.isTourRunning
			}
		}),


		mounted (){
			this.updateList()

			// setTimeout( () => {
			// 	if(this.isTourRunning){
			// 		window.location.hash = '/settings/menu'
			//
			// 		this.$store.commit(tourMutations.JUMP_TO_SETTINGS_BIT)
			// 	}
			// }, 100)
		},

		watch: { '$route'() { this.updateList() } },

		methods: {
			routeTo (pRouteTo){
				if (this.breadcrumbList[pRouteTo].link){
					this.$router.push(this.breadcrumbList[pRouteTo].link)

					this.$store.dispatch(analyticsActions.PAGE_VIEW, [this.breadcrumbList[pRouteTo].link, this.breadcrumbList[pRouteTo].name])

				}
			},

			updateList (){
				this.breadcrumbList = this.$route.meta.breadcrumb
			}
		}

	}
</script>

<style lang="less" scoped>


	.settings-mode{
		position: absolute;
		left: 0px;
		right: 0px;
		top: 0px;
		bottom: 0px;
		padding-top: 15px;

		.close{
			opacity: 0.5;
			position: absolute;
			right: 0px;
			top: 0px;
			padding: 10px;
			cursor: pointer;
			z-index: 999999999;

			&:hover{
				opacity: 1;
			}
		}

		.breadcrumbs{
			-webkit-app-region: drag;

			//background-color: red;
			padding: 0px;
			margin: 0px;
			position: absolute;
			left: 0px;
			right: 0px;
			top: 0px;
			z-index: 99999999;
			padding-top: 10px;
			padding-left: 10px;
			-webkit-touch-callout: none; /* iOS Safari */
			-webkit-user-select: none; /* Safari */

			padding-bottom: 0px;
			font-size: 11px;
			text-transform: uppercase;
			border-bottom: 1px solid darken(white, 60%);

			li {
				display: inline-block;
				margin-right: 5px;
				margin-bottom: 5px;

				a {
					padding-right: 5px;
				}
			}

			li:after {
				content: '//';
			}

			li:last-child:after {
				content: '';
			}
		}

		&.is-tour-running{
			& *:not(.tour-bubble){
				pointer-events: none;
				/*border: 1px solid hotpink;*/
			}
		}

		.router-view{
			margin-top: 20px;
		}

	}
</style>