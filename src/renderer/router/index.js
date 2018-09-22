import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/agent',
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
							{ name: 'About CYRUS' },

						]
					}
				},
				{
					path: 'create',
					component: require('@/components/SettingsPage/TemplateForm').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Create new snippet' },

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
							{ name: 'Snippets' },

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
							{ name: 'Snippets', link: '/settings/templates' },
							{ name: 'Edit snippet' },

						]
					}
				},
				{
					path: 'feedback',
					component: require('@/components/SettingsPage/Feedback').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Feedback' },

						]
					}
				},
				{
					path: 'export',
					component: require('@/components/SettingsPage/Export').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Export snippets' },

						]
					}
				},
				{
					path: 'import',
					component: require('@/components/SettingsPage/Import').default,
					meta: {
						breadcrumb: [
							{ name: 'Settings', link: '/settings/menu' },
							{ name: 'Import snippets' },

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
			redirect: '/agent'
		}
	]
})
