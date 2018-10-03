<template>
	<div class="templates-page"  :class="{ 'has-selected-snippets': getSelectedSnippets.length > 0 }">
		<div class="templates-list-container">
			<div v-if="data.length == 0">
				<h1>Snippets</h1>

				<p>
					This page would list all your snippets and provide you with a way of filtering your snippets by the tags you can use to organise your snippets....but you do not have any set up yet.
				</p>

				<router-link tag="a" class="button primary xcreate-new-button" to="/settings/create">
					Click here to create a new snippet
				</router-link>

			</div>

			<div v-else>
				<div class="tags-container" v-if="tags.length > 0">
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

				<h1>Snippets</h1>
				<div style="margin-top: -10px">({{ numRecords }})</div>

				<br />

				<div class="scroller">
					<ul>
						<li class="item-container" v-for="item in data">
							<label v-bind:for="'check' + item.id">
								<router-link tag="a" :to="{ name: 'edit', params: { id: item.id } }" class="button primary go-button">
									<span class=" fa fa-chevron-right"></span>
									&nbsp;
									Edit
								</router-link>

								<input class="check" type="checkbox"

									   @change="onSelectedChanged(item.id, $event)"
									   v-bind:value="item.isSelected"
									   v-bind:id="'check' + item.id" />

								<!--<a v-bind:href="'#/settings/edit/' + item.id">{{item.name}}</a>-->
								<!--<br />-->
								{{ item.id }}
								<div class="name code">{{ item.isSelected }}  {{item.name}}</div>
								<div class="description code">{{item.description}}</div>


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
							</label>
						</li>
					</ul>
				</div>


			</div>

		</div>

		<div class="action-buttons">
			{{ getSelectedSnippets.length }}
			selected (<a>clear</a>)

			<span class="right">
				<a class="button">Delete</a>
				<a class="button primary">Export</a>
			</span>
		</div>
	</div>
</template>

<script>
	import _ from 'underscore'
	import { snippetsMutations } from '../../store/types'

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

			hasTemplates() {
				return this.$store.state.Snippets.hasUserGeneratedSnippets
			},

			getSelectedSnippets() {
				return this.$store.getters.getSelectedSnippets()
			},

			userDataLength(){
				let data = this.$store.state.Snippets.data.filter(item => {
					let inc = item.language != 'Clippy'
					return inc
				})

				return data.length
			},

			numRecords() {
				return this.data.length + (this.selectedTags.length > 0 ? ` of ${this.userDataLength}` : '')
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
			},

			onSelectedChanged (id, e){
				this.$store.commit(snippetsMutations.TOGGLE_SELECT_ITEM, {id: id, isSelected: e.target.checked})

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

	.templates-page{
		position: absolute;
		left: 0px;
		right: 0px;
		top: 10px;
		bottom: 0px;

		.action-buttons{
			box-sizing: border-box;
			display: none;
			height: 30px;
			position: absolute;
			bottom: 10px;
			right: 10px;
			left: 10px;

			.right{
				float: right;
			}
		}

		&.has-selected-snippets{
			.templates-list-container {
				bottom: 50px;// !important;
			}

			.action-buttons{
				display: block;
			}
		}
	}

	.templates-list-container{
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
		padding-top: 5px;
		z-index: 1;
		background-color: #292929;
		max-height: 55px;
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

		ul{
			&:before{
				content: 'Filter by tag(s): '
			}
		}

	}



	.scroller{
		padding: 0px;
		margin: 0px;


		.item-container{
			padding: 0px;
			margin: 0px;
			margin-bottom: -22px;

			label {
				margin: 0px;
				transition: all 0.25s ease-in-out;
				background-color: fade(black, 0%);
				display: block;
				margin-bottom: 10px;
				margin-right: 5px;
				position: relative;
				min-height: 60px;
				padding: 20px;
				padding-left: 30px;
				padding-right: 40px;
				cursor: pointer;
				box-sizing: border-box;
				border-bottom: 1px solid fade(white, 20%);

				&:hover, & *:hover {
					text-decoration: none;
				}

				&:hover {
					background-color: fade(black, 20%);
				}
			}
			.go-button{
				-webkit-transition: all 0.25s ease-in-out;
				-moz-transition: all 0.25s ease-in-out;
				-ms-transition: all 0.25s ease-in-out;
				-o-transition: all 0.25s ease-in-out;
				transition: all 0.25s ease-in-out;
				border-radius: 30px;
				float: right;
				margin-left: 10px;
				margin-bottom: 10px;
				min-width: 0px;
				height: 30px;
				overflow: hidden;
				width: 30px;
				white-space: nowrap;
				direction: rtl;
				position: absolute;
				right: 10px;
				top: 10px;

				&:hover{
					width: 80px;
				}
			}

			.check{
				position: absolute;
				left: 10px;
				top: 10px;
			}

			.name{
				font-size: 13px;
				padding-bottom: 5px;
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
				/*float: right;*/
				/*max-width: 45%;*/
				text-align: left;
				white-space: nowrap;
				overflow: auto;
				margin-top: 10px;

				li{
					display: inline-block;
					margin-bottom: 5px;

				}
			}
		}
	}

</style>