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

# Router

* 基本使用

  ```html
  
  ```

* 带参数的路由匹配

  * 访问参数
  * 使用带有参数的路由时需要注意的是，当用户从 `/users/johnny` 导航到 `/users/jolyne` 时，**相同的组件实例将被重复使用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会被调用**
  * 正则表达式匹配

* 嵌套路由