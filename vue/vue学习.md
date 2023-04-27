# vue学习

1. ``` import App from './App.vue' ``` 如何理解？

   * App.vue 文件中 没有export ，import引入的是什么？

   以下是控制台打出的app对象

   ![image-20230411160721266](https://s2.loli.net/2023/04/11/La12qCQgO65uUi8.png)

这里import 应该同 import css文件类似，是引入了整个文件。

Vue SFC 是一个框架指定的文件格式，因此必须交由 [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) 编译为标准的 JavaScript 和 CSS，一个编译后的 SFC 是一个标准的 JavaScript(ES) 模块

2. reactive、ref

   * reactive对原始类型无效

   * 将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性

   * ref将传入参数的值包装为一个带 `.value` 属性的 ref 对象

     |                  | reactive | ref     |
     | ---------------- | -------- | ------- |
     | 整个对象传入函数 | &check;  | &check; |
     | 对象属性传入函数 | &cross;  | &cross; |

   有响应性：

   <img src="https://s2.loli.net/2023/04/14/v6qNwKDht21R5VE.png#pic_left" alt="image-20230414155350188"  />

   无响应性：

   ![image-20230414155805291](https://s2.loli.net/2023/04/14/Vz26iHMGoRSXdqT.png)

3. watch

   * 它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组。

   * 不能直接侦听响应式对象的属性值，这里需要用一个返回该属性的 getter 函数。

     ```
     watch(
       () => obj.count,
       (count) => {
         console.log(`count is: ${count}`)
       }
     )
     ```

   * 如果想在侦听器回调中能访问被 Vue 更新**之后**的 DOM，你需要指明 `flush: 'post'` 选项

   * 侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏

4. watchEffect

5. 模版引用ref

   * ref引用的dom对象需要在**组件挂载后**才能访问。
   * ref引用组件后，默认不能访问组件内属性和方法。访问组件内方法时需要组件内通过`defineExpose({  a,  b })`暴露。

 6. css绑定

    * class可绑定对象，通过boolean值来确定css值

      ```js
      <div
        class="static"
        :class="{ active: isActive, 'text-danger': hasError }"
      ></div>
      ```

    * 

## 组件

* 父组件传递数据到子组件

  * Props


  ```js
  //子组件定义
  defineProps(['title'])
  //父组件
  <BlogPost :title="post.commentIds" />
  //使用v-bind一次绑定传递多个属性
  <BlogPost v-bind="post" />
  //等同于
  <BlogPost :id="post.id" :title="post.title" />
  ```

  * 单向数据流

* 监听子组件发生的事件

  * 组件触发的事件**没有冒泡机制**

  ```
  #父组件
  @enlarge-text
  #子组件
  defineEmits(['enlarge-text'])
  const emit = $emit('enlarge-text')
  ```

  * 如果一个原生事件的名字 (例如 `click`) 被定义在 `emits` 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件

* 使用 `<component :is="...">` 来在多个组件间作切换时

* 组件使用v-model,v-model默认属性名称为：modelValue，可以通过v-model:title将modelValue改为title

  ```js
  //当在父组件使用 v-model时
  <CustomInput v-model="searchText" />
  ```

  ```js
  //子组件 需要绑定value属性到modelValue，定义input事件发送update:modelValue
  //1.将内部原生 <input> 元素的 value attribute 绑定到 modelValue prop
  //2.当原生的 input 事件触发时，触发一个携带了新值的 update:modelValue 自定义事件
  <!-- CustomInput.vue -->
  <script setup>
  defineProps(['modelValue'])
  defineEmits(['update:modelValue'])
  </script>
  
  <template>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </template>
  
  ```

* 透传 attribute, (“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 [props](https://cn.vuejs.org/guide/components/props.html) 或 [emits](https://cn.vuejs.org/guide/components/events.html#defining-custom-events) 的 attribute 或者 `v-on` 事件监听器。最常见的例子就是 `class`、`style` 和 `id`)

  * 透传的 attribute 会自动被添加到根元素上
  * 子组件的根节点上渲染另一个组件时，透传的attribute会继续传递下去
  * 有着多个根节点的组件没有自动 attribute 透传行为
  * 可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute
  *  `attrs` 对象总是反映为最新的透传 attribute，但它并不是响应式的 (考虑到性能因素)。你不能通过侦听器去监听它的变化，需要响应性时，可以使用 prop。或者你也可以使用 `onUpdated()` 使得在每次更新时结合最新的 `attrs` 执行副作用

* 插槽slot

  * `<slot>` 元素是一个**插槽出口** (slot outlet)，标示了父元素提供的**插槽内容** (slot content) 将在哪里被渲染。

    ![image-20230415133356452](https://s2.loli.net/2023/04/15/eYUqL9JTNzn4E6P.png)

  * 具名插槽

    * <slot>` 元素可以有一个特殊的 attribute ` name，没有提供 `name` 的 `<slot>` 出口会隐式地命名为“default

      ```js
      //父组件使用
      <template v-slot:name></template>
      //子组件使用来接收父组件对应的template中的内容
      <slot name="name"></slot> 
      ```

    ![image-20230415135216881](https://s2.loli.net/2023/04/15/o2au8fNWxFzZqSL.png)

    * 接收插槽内的数据

      ![image-20230415135525956](https://s2.loli.net/2023/04/15/VRsUlp2eWg1rhCZ.png)

    * 无渲染组件

* 依赖注入

  * 可以跨多层级传递数据：

    ```js
    //父组件提供
    const message = ref('hello')
    provide('message',message)
    //子孙组件注入
    const message = inject('message')
    ```

  * 尽可能将任何对响应式状态的变更都保持在供给方组件中

  * 需要在注入方组件中更改数据时，推荐在供给方组件内声明并提供一个更改数据的方法函数，将此方法提供给注入方。

* 编写提供给其他开发者使用的组件库，建议最好使用 Symbol 来作为注入名以避免潜在的冲突

  ```js
  //Symbol
  
  ```

* 异步组件 `defineAsyncComponent`，接收一个返回 Promise 的加载函数。

  * 异步引入组件及使用

    ```js
    <script setup>
    import { defineAsyncComponent } from 'vue'
    
    const AdminPage = defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
    </script>
    
    <template>
      <AdminPage />
    </template>
    ```

    

  * 

*  

## 组合式函数

## 自定义指令

* **不**推荐在组件上使用自定义指令

## Transition

* `<Transition>` 仅支持单个元素或组件作为其插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素。