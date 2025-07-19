import "@/assets/styles/main.scss";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";

import directives from "@/directives";
import plugins from "@/plugins";
import router from "@/router";
import stores from "@/stores";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as vuetifyComponents from "vuetify/components";
import * as vuetifyDirectives from "vuetify/directives";

const vuetify = createVuetify({
  components: vuetifyComponents,
  directives: vuetifyDirectives,
});

const app = createApp(App);

directives(app);
plugins(app);
router(app);
stores(app);

app.use(vuetify).mount("#app");
