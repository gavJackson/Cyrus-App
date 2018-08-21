<template>
	<div class="settings-mode dialog">
		<a class="close not-a-link" href="/" ><span class="fa fa-times-circle"></span></a>

		<ul class="breadcrumbs xbottom-bordered">
			<li class="crumb">
				<a href="/" tabindex="0">Clippy</a>
			</li>

			<li class="crumb"
				v-for="(breadcrumb, idx) in breadcrumbList"
			   :key="idx"
			   @click="routeTo(idx)">

				<a tabindex="0" :class="{'not-a-link': !breadcrumb.link}">{{ breadcrumb.name}}</a>
			</li>

		</ul>

		<router-view class="router-view"></router-view>

	</div>
</template>

<script>
	export default {
		name: "SettingsPage",

		data (){
			return {
				breadcrumbList: []
			}
		},

		mounted (){ this.updateList() },
		watch: { '$route'() { this.updateList() } },
		methods: {
			routeTo (pRouteTo){
				if (this.breadcrumbList[pRouteTo].link){
					this.$router.push(this.breadcrumbList[pRouteTo].link)
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
			right: 10px;
			top: 10px;
			cursor: pointer;
			z-index: 1;

			&:hover{
				opacity: 1;
			}
		}

		.breadcrumbs{
			/*background-color: red;*/
			-webkit-app-region: drag;
			/*cursor: move;*/
			padding: 0px;
			margin: 0px;
			position: absolute;
			left: 0px;
			right: 0px;
			top: 0px;
			padding-top: 10px;
			padding-left: 10px;
			-webkit-touch-callout: none; /* iOS Safari */
			-webkit-user-select: none; /* Safari */

			padding-bottom: 0px;
			font-size: 11px;
			text-transform: uppercase;

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

		.router-view{
			margin-top: 20px;
		}



	}
</style>