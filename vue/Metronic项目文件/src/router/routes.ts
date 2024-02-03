import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/system/employee/employee-list",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      // {
      //   path: "/home/common-employee",
      //   name: "home-common-employee",
      //   component: () => import("@/views/project/home/EmployeeHome.vue"),
      //   meta: {},
      // },
      // {
      //   path: "/home/all-info",
      //   name: "home-all-info",
      //   component: () => import("@/views/project/home/ALLInfoHome.vue"),
      //   meta: {
      //     pageTitle: "首页",
      //     breadcrumbs: ["首页"],
      //   },
      // },
      {
        path: "/system/department/department-list",
        name: "system-department-list",
        component: () => import("@/views/system/DepartmentTree.vue"),
        meta: {
          pageTitle: "部门管理",
          breadcrumbs: ["系统管理", "部门管理"],
        },
      },
      {
        path: "/system/employee/employee-list",
        name: "system-employee-list",
        component: () => import("@/views/system/EmployeeList.vue"),
        meta: {
          pageTitle: "员工管理",
          breadcrumbs: ["系统管理", "员工管理"],
        },
      },
      {
        path: "/system/setting/setting-role/:clientId",
        name: "system-setting-role",
        component: () => import("@/views/system/RoleList.vue"),
        meta: {
          pageTitle: "角色管理",
          breadcrumbs: ["系统管理", "系统设置"],
        },
      },
      {
        path: "/self-setting/self/info",
        name: "self-setting-self-info",
        component: () => import("@/views/system/SelfInfo.vue"),
        meta: {
          pageTitle: "个人信息",
          breadcrumbs: ["系统管理", "个人信息"],
        },
      },
      {
        path: "/other/feedback/add",
        name: "other-feedback-add",
        component: () => import("@/views/system/feedback/AddFeedback.vue"),
        meta: {
          pageTitle: "新增反馈",
          breadcrumbs: ["其他功能", "新增反馈"],
        },
      },
      {
        path: "/other/feedback/detail/:id",
        name: "other-feedback-detail",
        component: () => import("@/views/system/feedback/FeedbackDetail.vue"),
        meta: {
          pageTitle: "反馈详情",
          breadcrumbs: ["其他功能", "反馈详情"],
        },
      },
      {
        path: "/other/feedback/my-list",
        name: "other-feedback-my-list",
        component: () => import("@/views/system/feedback/FeedbackList.vue"),
        meta: {
          pageTitle: "我的反馈",
          breadcrumbs: ["其他功能", "我的反馈"],
        },
      },
      {
        path: "/other/feedback/list",
        name: "other-feedback-list",
        component: () => import("@/views/system/feedback/FeedbackList.vue"),
        meta: {
          pageTitle: "反馈列表",
          breadcrumbs: ["其他功能", "反馈列表"],
        },
      },
      {
        path: "/other/notification/add",
        name: "other-notification-add",
        component: () => import("@/views/system/notification/AddNotification.vue"),
        meta: {
          pageTitle: "新增通知",
          breadcrumbs: ["其他功能", "通知通告"],
        },
      },
      {
        path: "/other/notification/detail/:id",
        name: "other-notification-detail",
        component: () => import("@/views/system/notification/NotificationDetail.vue"),
        meta: {
          pageTitle: "通知详情",
          breadcrumbs: ["其他功能", "通知通告"],
        },
      },
      {
        path: "/other/notification/my-list",
        name: "other-notification-my-list",
        component: () => import("@/views/system/notification/NotificationList.vue"),
        meta: {
          pageTitle: "我的通知",
          breadcrumbs: ["其他功能", "通知通告"],
        },
      },
      {
        path: "/other/notification/list",
        name: "other-notification-list",
        component: () => import("@/views/system/notification/NotificationList.vue"),
        meta: {
          pageTitle: "通知列表",
          breadcrumbs: ["其他功能", "通知通告"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
      {
        path: "/sso-callback",
        name: "sso-callback",
        component: () =>
          import("@/views/crafted/authentication/sso-flow/SSOCallback.vue"),
        meta: {
          pageTitle: "登录处理",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

export default routes;
