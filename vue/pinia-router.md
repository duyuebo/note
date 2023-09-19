# Pinia

* 整个应用所有组件都可以访问的数据。适用于，例如购物车。

* `store` 是一个用 `reactive` 包装的对象

* 直接解构store将失去响应性

  ```js
  <script setup>
      const store = useCounterStore()
      const { name, doubleCount } = store 
      name // 将始终是 "Eduardo" 
      doubleCount // 将始终是 0
  </script>
  ```

* 为了从 store 中提取属性时保持其响应性，你需要使用 `storeToRefs()`

  <script setup>
  import { storeToRefs } from 'pinia'
  const store = useCounterStore()
  // `name` 和 `doubleCount` 是响应式的 ref
  // 同时通过插件添加的属性也会被提取为 ref
  // 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
  const { name, doubleCount } = storeToRefs(store)
  // 作为 action 的 increment 可以直接解构
  const { increment } = store
  </script>

* state

* *pinia* 中状态的值仅在内存中存在，刷新会导致浏览器存储中的数据没了。

# Router

* 基本使用

  ```html
  
  ```

* 带参数的路由匹配

  * 访问参数
  * 使用带有参数的路由时需要注意的是，当用户从 `/users/johnny` 导航到 `/users/jolyne` 时，**相同的组件实例将被重复使用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会被调用**
  * 正则表达式匹配

* 嵌套路由

  * 嵌套路由中，子路由匹配路径使用 /开头

    ```typescript
    const routes: Array<RouteRecordRaw> = [
      {
        path: "/",
        redirect: "/dashboard",
        component: () => import("@/layouts/main-layout/MainLayout.vue"),
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
          }
        ]
      }
    ];
    ```

    如果子路由的path的最前边有“/”，则不需要加父路由的路径即可访问此子组件,此组件的渲染位置还是父组件的```<router-view></router-view>```标签内

    对应以上代码的MainLayout.vue页面中定义的<router-view></router-view>内

  * 多个路由使用同一个path例如 /，主要配合子路由使用，此时子路由使用/开头表示，父路由相同的path主要用来指示子路由渲染的位置

    ```typescript
    // path:"/" 没有实际的意义，主要用来指示子路由/dashboard时展示的视图在MainLayout.vue的路由内定义
    {
        path: "/",
        redirect: "/dashboard",
        component: () => import("@/layouts/main-layout/MainLayout.vue"),
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
        ]
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
        ]
    }
    ```

    

  *  

* 