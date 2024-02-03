import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useConfigStore } from "@/stores/config";
import { ssoAuthStore } from "@/stores/ssoAuth";
import routes from "./routes";

// import store from "@/store";
// import ApiService from "@/core/services/ApiService";
// import JwtService from "@/core/services/JwtService";

import { NoNeedRightPaths } from "./noNeedRightPaths";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = ssoAuthStore();
  const configStore = useConfigStore();

  // current page view title
  console.log("路由跳转", to.meta.pageTitle);
  let title = "";
  if (to.meta.pageTitle) {
    title = to.meta.pageTitle + "-";
  }
  document.title = `${title}${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  // authStore.verifyAuth();

  const result = NoNeedRightPaths.find(
    (currentValue) => currentValue === to.name
  );
  if (result) {
    //此条件下不需要验证直接放行
    next();
  } else {
    if (authStore.isAuthenticated) {
      next();
    } else {
      // TODO 改为跳转到SSO登录地址
      next({ name: "sign-in" });
    }
  }
});

export default router;
