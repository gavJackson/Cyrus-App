import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'agent-page',
			component: require('@/components/AgentPage').default
		},
		{
			path: '/settings',
			name: 'settings-page',
			component: require('@/components/SettingsPage').default,
			children: [
				{
					path: 'menu',
					name: 'menu',
					component: require('@/components/SettingsPage/Menu').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings' },
						]
					}
				},
				{
					path: 'menu/:message',
					name: 'menuWithMessage',
					component: require('@/components/SettingsPage/Menu').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings' },
						]
					}
				},
				{
					path: 'about',
					component: require('@/components/SettingsPage/About').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'About Clippy' },

						]
					}
				},
				{
					path: 'create',
					component: require('@/components/SettingsPage/TemplateForm').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Create new template' },

						]
					}
				},
				{
					path: 'templates',
					name: 'templates',
					component: require('@/components/SettingsPage/Templates').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Templates' },

						]
					}
				},
				{
					path: 'edit/:id',
					name: 'edit',
					component: require('@/components/SettingsPage/TemplateForm').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Templates', link: '/settings/templates' },
							{ name: 'Edit template' },

						]
					}
				},
				{
					path: 'export',
					component: require('@/components/SettingsPage/Export').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Export templates' },

						]
					}
				},
				{
					path: 'import',
					component: require('@/components/SettingsPage/Import').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Import templates' },

						]
					}
				},
				{
					path: 'general',
					component: require('@/components/SettingsPage/GeneralSettings').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'General settings' },

						]
					}
				},
				{
					path: 'help',
					component: require('@/components/SettingsPage/Help').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Help' },

						]
					}
				},
			]
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})
