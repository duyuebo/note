# Spring Boot

1. @SpringBootApplication

   等于以下3个注解

   * @ComponentScan
   * @EnableAutoConfiguration
   * @SpringBootConfiguration
     * @Configuration 和 @Component注解的区别
   * 

2. 配置log

   ```java
   Because the standard logback.xml configuration file is loaded too early, you cannot use extensions in it. You need to either use logback-spring.xml or define a logging.config property.
   ```

3. 