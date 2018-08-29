// //handle setupevents as quickly as possible
// const setupEvents = require('./../../installers/setupEvents')
// if (setupEvents.handleSquirrelEvent()) {
// 	// squirrel event handled and app will exit in 1000ms, so don't do anything else
// 	// return true
// }


import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// debugger
/* eslint-disable no-new */
new Vue({
	components: {App},
	router,
	store,
	template: '<App/>'
}).$mount('#app')
