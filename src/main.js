import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";
import ru from "vee-validate/dist/locale/ru";

import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";

Vue.config.productionTip = false;

Validator.localize("ru", ru);
Vue.use(VeeValidate);

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
