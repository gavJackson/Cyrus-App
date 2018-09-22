<template>
	<nav class="main-nav">

		<!-- /////////////////////////////////////////////////////////////////

		menu item links

		///////////////////////////////////////////////////////////////// -->

		<ul>
			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/templates">
					<div class="far fa fa-edit fa-3x fa-border fa-fw"></div>

					<div class="label">Edit snippets</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/create">
					<div class="far fa fa-file-alt fa-3x fa-border fa-fw"></div>

					<div class="label">Create new snippet</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/feedback">
					<div class="far fa fa-comments fa-3x fa-border fa-fw"></div>

					<div class="label">Feedback</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/general">
					<div class="far fa fa-cog fa-3x fa-border fa-fw"></div>

					<div class="label">General settings</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/import">
					<div class="far fa fa-file-import fa-3x fa-border fa-fw"></div>

					<div class="label">Import snippets</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/export">
					<div class="far fa fa-file-export fa-3x fa-border fa-fw"></div>

					<div class="label">Export snippets</div>
				</router-link>
			</li>



			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/help">
					<div class="far fa fa-question fa-3x fa-border fa-fw"></div>

					<div class="label">Help</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/settings/about">
					<div class="far fa fa-info fa-3x fa-border fa-fw"></div>

					<div class="label">About</div>
				</router-link>
			</li>

			<li>
				<router-link tag="a" class="icon-link not-a-link" to="/agent">
					<div class="far fa fa-times-circle fa-3x fa-border fa-fw"></div>

					<div class="label">Exit settings</div>
				</router-link>
			</li>
		</ul>


		<!-- /////////////////////////////////////////////////////////////////

		message

		///////////////////////////////////////////////////////////////// -->

		<div class="message animated fadeOutDown delay-3s"
			 v-if="message">

			{{ message }}
		</div>


	</nav>
</template>

<script>
	export default {
		name: "Menu",

		data () {
			return {
				message: "",
			}
		},


		created(){
			this.message =  this.$route.params.message

			if(this.message){
				let myNotification = new Notification('CYRUS', {
					body: this.message,
					silent: true,
				})
			}
		},

	}
</script>

<style lang="less" scoped>


	.main-nav{
		ul{
			margin: 0px;
			padding: 0px;
			padding-top: 0px;
			list-style: none;
			display: block;
			li{
				box-sizing: border-box;
				display: inline-block;
				width: 32%;
				height: 100px;
				text-align: center;
				cursor: pointer;
				padding: 15px 20px;

				.fa{
					opacity: 0.25;
					border: none;
					display: block;
					margin: 0px auto;

				}

				.icon-link{
					cursor: pointer !important;
				}

				.label{
					padding-top: 10px;
					/*display: block;*/
					/*vertical-align: top;*/
					font-size: 12px;
					height: 40px;
					overflow: hidden;
				}

				&:hover{
					.fa{
						opacity: 1;
						background-color: black;
						color: white;
					}
				}
			}
		}

		.message{
			bottom: 175px;
		}
	}
</style>