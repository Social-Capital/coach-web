import Vue from 'vue'
import MintUI from 'mint-ui'
import App from './App.vue'
import './servers/style.less';
import 'mint-ui/lib/style.css'
import Api from './servers/index.js';


Vue.prototype.$api = Api;
Vue.config.productionTip = false
Vue.use(MintUI);
new Vue({
  render: h => h(App),
}).$mount('#app')
