<template>
	<div class="templates-list-container">

		<!--<strong>Filter by tag</strong>-->

		<div class="tags-container">
			<ul>
				<li class="tag"
					v-for="item in tags"

					 :class="{ 'in-active': selectedTags.indexOf(item.tag) == -1}"
					@click="selectItem(item.tag, $event)">
					{{ item.tag }} ({{ item.count }})
				</li>
			</ul>
		</div>

		<router-link tag="a" class="button primary create-new-button" to="/settings/create">
			Create new
		</router-link>

		<h1>Templates</h1>

		<div class="scroller">

			<ul>
				<li class="item-container" v-for="item in data">


					 <router-link tag="div" :to="{ name: 'edit', params: { id: item.id } }">

						 <div class="tags">
							 <ul>
								 <li class="tag"

									 :class="{ 'in-active': selectedTags.indexOf(item) == -1}"
									 v-for="item in item.tags"
									 @click="selectItem(item, $event)">
									 {{ item }}
								 </li>
							 </ul>
						 </div>

						 <div class="name code">{{item.name}}</div>

						 <!--<div class="icons-container">-->
							 <!--<span class="fa fa-edit" title="Edit template"></span>-->
						 <!--</div>-->

						 <div class="description code">{{item.description}}</div>

					 </router-link>
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
	import _ from 'underscore'

	export default {
		name: "Templates",

		data () {
			return {
				selectedTags: [],
			}
		},

		computed: {
			data() {
				let data = this.$store.state.Snippets.data.filter(item => {
					let inc = item.language != 'Clippy'

					if(inc){
						if(this.selectedTags.length > 0){
							inc = _.intersection(this.selectedTags, item.tags).length > 0
						}
					}

					return inc
				})


				return data
			},

			tags() {
				return this.$store.getters.getTags()
			},
		},

		methods: {
			selectItem (tag, event) {
				event.preventDefault()

				let index = this.selectedTags.indexOf(tag)

				if(index == -1){
					this.selectedTags.push(tag)
				}
				else{
					this.selectedTags.splice(index, 1)
				}

				return false
			}
		}
	}
</script>

<style lang="less" scoped>
	ul{
		width: 100%;
		display: block;
		margin: 0px;
		padding: 0px;
	}

	.templates-list-container{
		overflow: auto;
		overflow: auto;
		position: absolute;
		top: 90px;
		bottom: 10px;
		left: 10px; right: 10px;
		top: 10px;

	}

	.create-new-button{
		float: right;
		margin-top: 10px;
		margin-right: 10px;
	}


	.tags-container{
		position: sticky;
		top: 0px;
		z-index: 1;
		background-color: black;
		max-height: 50px;
		overflow-x: auto;
		overflow-y: fragments;
		overflow: auto;
		white-space: nowrap;

		.tag{
			margin-bottom: 5px;
			cursor: pointer;
			/*opacity: 0.5;*/

			/*&.is-selected{*/
				/*opacity: 1;*/
			/*}*/
		}

	}

	.scroller{


		.item-container{
			transition: all 0.25s ease-in-out;
			background-color: rgba(255,255,255, 0.15);
			display: block;
			margin-bottom: 10px;
			margin-right: 5px;
			position: relative;
			min-height: 35px;
			padding: 10px;
			cursor: pointer;

			&:hover, & *:hover{
				text-decoration: none;
			}

			&:hover{
				background-color: rgba(255,255,255, 0.25);
			}

			.name{
				font-size: 13px;
				padding-bottom: 10px;
			}

			.icons-container{
				float: right;
			}

			.description{
				opacity: 0.5;
				font-weight: normal;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.tags{
				float: right;
				/*max-width: 45%;*/
				text-align: right;
				white-space: nowrap;
				overflow: auto;

				li{
					display: inline-block;
					margin-bottom: 5px;

				}
			}
		}
	}

</style>