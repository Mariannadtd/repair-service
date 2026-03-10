import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import CreateRequestView from "../views/CreateRequestView.vue";
import DispatcherView from "../views/DispatcherView.vue";
import MasterView from "../views/MasterView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginView },
    { path: "/create", name: "create", component: CreateRequestView },
    {
      path: "/dispatcher",
      name: "dispatcher",
      component: DispatcherView,
      meta: { role: "dispatcher" },
    },
    {
      path: "/master",
      name: "master",
      component: MasterView,
      meta: { role: "master" },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.name === "login") return true;

  if (!auth.user) {
    return "/login";
  }

  if (!to.meta.role) return true;

  if (auth.user.role !== to.meta.role) {
    return auth.user.role === "dispatcher" ? "/dispatcher" : "/master";
  }

  return true;
});

export default router;
