import { createWebHistory, createRouter } from "vue-router";

let routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/Admin.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default (app) => {
  app.use(router);
};
