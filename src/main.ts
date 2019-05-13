import Vue from 'vue';
import App from './App.vue';
import './assets/css/common.scss';
import router from './router';
import global from './utils/global';
import fitllers from './fillters/index';
import qs from 'qs';

Vue.config.productionTip = false;

// element-ui
import 'element-ui/lib/theme-chalk/index.css';
import ElementUi, { Message } from 'element-ui';

Vue.use(ElementUi);
// axios
import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use((config) => {
  // 对请求数据做统一处理
  config.paramsSerializer = function (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  };
  return config;
});
axios.interceptors.response.use((config) => {
  // 对返回数据做统一处理
  // if (config.data.code === 0) {
  //     return Promise.resolve(config.data);
  // } else {
  //     return Promise.resolve(config.data.message);
  // }
  return config;
}, () => {
  Message.error('请求错误');
  return Promise.reject(false);
});
// 全局配置
declare module 'vue/types/vue' {
  interface Vue {
    $global: any;
  }
}
// 全局常量
Vue.prototype.$global = global;
// 全局组件
Vue.component('LoadingBox', () => import('./components/LoadingBox.vue'));
Vue.component('SingleUpload', () => import('./components/SingleUpload.vue'));
Vue.component('MulUpload', () => import('./components/MulUpload.vue'));
Vue.component('MyUpload', () => import('./components/MyUpload.vue'));
// Vue.component('MulUpload', () => import('./components/MulUpload.vue'));
// 全局filter
Object.keys(fitllers).forEach((key) => {
  Vue.filter(key, (fitllers as any)[key]);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
