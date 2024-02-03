# 使用说明

1. 打开Metronic项目模板的src目录，将文件拷贝到项目下。

2. 配置左侧菜单

   * 在src\main.ts 里加载路由配置

     ```ts
     import router from "./router";
     app.use(router);
     ```

   * 编写获取菜单文件UserMenuConfig.ts，放置目录core/config目录下。

   * 修改src\layouts\default-layout\components\sidebar\SidebarMenu.vue文件中，引入UserMenuConfig

     ```ts
     // import MainMenuConfig from "@/layouts/default-layout/config/MainMenuConfig";
     import getUserMenu from "@/core/config/UserMenuConfig";
     import type { IMenuItem } from "@/core/config/SystemType";
     
     const UserMenus = ref<IMenuItem[] | null>();
     onMounted(async () => {
       UserMenus.value = await getUserMenu();
       if (scrollElRef.value) {
         scrollElRef.value.scrollTop = 0;
       }
     });
     ...
     ```

   * 修改菜单图标样式为bootstrap。src\layouts\default-layout\config\DefaultLayoutConfig.ts

     ```ts
             // iconType: "keenthemes",
             iconType: "bootstrap",
     ```

   * 

3. 安装json-bigint

   ```shell
   npm install json-bigint --save
   ```

4. 