# Spring

## 一. spring-boot

1. 项目配置文件``` application.yml```多模块合并的问题

   * 同名的application.yml不会合并生效

   * 要想起到application.yml合并生效的效果,需要子模块取名application-xxx.yml,同时在application.yml中设置

     ```yml
     spring:
       profiles:
         active: xxx
     ```

   * 要想同时可以切换环境,active项可以同时配置多个值

     ```yml
     spring:
       profiles:
         active: dev,xxx-dev
     ```

   * 可以使用 include 包含通用配置文件

     ```yaml
     spring:
       application:
         name: system-manage-bff
       profiles:
         include: repository
         active: dev
     ```

   * 

2. 



## 问题记录：

1. application.yml 中如何将字符串值直接赋值给Java对象？

   ```yaml
   # public void setTimeout(Duration timeout) {
   #		this.timeout = timeout;
   #}
   server:
     servlet:
       session:
         timeout: 60
   ```

2. 



