### log

#### 问题

1. 如何配置日志异步输出？

   logback中按如下进行配置

   ```xml
   <!--异步日志 配置异步appender并引用-->
   <appender name="async" class="ch.qos.logback.classic.AsyncAppender">
       <!--指定某个具体的 appender-->
       <appender-ref ref="rollFile"/>
   </appender>
   ```

   

2. 分布式系统中如何配置搜集日志？

   

##### 日志组件基本使用

1. slf4j+logback 或者 slf4j+log4j2 

   

![image-20201230172002717](/Users/dylan/Desktop/Develop/note/笔记/log使用/log.assets/image-20201230172002717-8590921.png)!![image-20201230210822050](/Users/dylan/Desktop/Develop/note/笔记/log使用/log.assets/image-20201230210822050-8590944.png)

2. 使用logback作为日志输出

   * 首先将系统中使用的其他日志框架转接到slf4j（系统引入的各种框架中可能使用了不同的日志框架），然后配置logback为系统日志

     ![image-20210102142408624](/Users/dylan/Desktop/Develop/note/笔记/log使用/log.assets/image-20210102142408624.png)

   * maven pom配置文件如下：

     ```xml
     <!--将其他框架日志转接到slf4j-->
     <dependency>
         <groupId>org.slf4j</groupId>
         <artifactId>jcl-over-slf4j</artifactId>
         <version>1.7.25</version>
     </dependency>
     <dependency>
         <groupId>org.slf4j</groupId>
         <artifactId>log4j-over-slf4j</artifactId>
         <version>1.7.25</version>
     </dependency>
     <dependency>
         <groupId>org.slf4j</groupId>
         <artifactId>jul-to-slf4j</artifactId>
         <version>1.7.30</version>
     </dependency>
     <!--slf4j日志门面-->
     <dependency>
         <groupId>org.slf4j</groupId>
         <artifactId>slf4j-api</artifactId>
         <version>1.7.30</version>
     </dependency>
     <!--logback作为日志实现-->
     <dependency>
         <groupId>ch.qos.logback</groupId>
         <artifactId>logback-classic</artifactId>
         <version>1.2.3</version>
     </dependency>
     ```

     

   * logback.xml配置日志输出

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
   
       <!--
       日志记录错误信息记录到 logback_error 调试信息记录到 logback_debug
       -->
       <!--
           配置集中管理属性
           我们可以直接改属性的 value 值
           格式：${name}
       -->
       <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c %M [%thread] %m%n"/>
       <!--
       日志输出格式：
           %-5level
           %d{yyyy-MM-dd HH:mm:ss.SSS}日期
           %c类的完整名称
           %M为method
           %L为行号
           %thread线程名称
           %m或者%msg为信息
           %n换行
         -->
       <!--定义日志文件保存路径属性-->
       <property name="log_dir" value="${catalina.home}/logs/wxApp"/>
   
   
       <!--控制台日志输出的 appender-->
       <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
           <!--控制输出流对象 默认 System.out 改为 System.err-->
           <target>System.out</target>
           <!--日志消息格式配置-->
           <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
               <pattern>${pattern}</pattern>
           </encoder>
       </appender>
   
       <!--日志拆分和归档压缩的 appender 对象-->
       <appender name="rollFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
           <!--日志文件保存路径-->
           <file>${log_dir}/logback_error.log</file>
           <!--日志消息格式配置-->
           <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
               <pattern>${pattern}</pattern>
           </encoder>
           <!--指定拆分规则-->
           <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
               <!--按照时间和压缩格式声明拆分的文件名-->
               <fileNamePattern>${log_dir}/logback_error.%d{yyyy-MM-dd}.log%i.gz</fileNamePattern>
               <!--按照文件大小拆分-->
               <maxFileSize>10MB</maxFileSize>
               <!--最多保留30天的文件，30天之前的将被清除-->
               <MaxHistory>30</MaxHistory>
               <!--该滚动策略日志的总大小，超过的日志会被清除-->
               <totalSizeCap>1GB</totalSizeCap>
           </rollingPolicy>
           <!--日志级别过滤器-->
           <filter class="ch.qos.logback.classic.filter.LevelFilter">
               <!--日志过滤规则-->
               <level>ERROR</level>
               <onMatch>ACCEPT</onMatch>
               <onMismatch>DENY</onMismatch>
           </filter>
       </appender>
   
       <!--日志拆分和归档压缩的 appender 对象-->
       <appender name="rollFileDebug" class="ch.qos.logback.core.rolling.RollingFileAppender">
           <!--日志文件保存路径-->
           <file>${log_dir}/logback_debug.log</file>
           <!--日志消息格式配置-->
           <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
               <pattern>${pattern}</pattern>
           </encoder>
           <!--指定拆分规则-->
           <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
               <!--按照时间和压缩格式声明拆分的文件名-->
               <fileNamePattern>${log_dir}/logback_debug.%d{yyyy-MM-dd}.log%i.gz</fileNamePattern>
               <!--按照文件大小拆分-->
               <maxFileSize>20MB</maxFileSize>
               <MaxHistory>5</MaxHistory>
               <!--该滚动策略日志的总大小，超过的日志会被清除-->
               <totalSizeCap>50MB</totalSizeCap>
           </rollingPolicy>
           <!--日志级别过滤器-->
           <filter class="ch.qos.logback.classic.filter.LevelFilter">
               <!--日志过滤规则-->
               <level>DEBUG</level>
               <onMatch>ACCEPT</onMatch>
           </filter>
       </appender>
   
       <!--异步日志-->
       <appender name="async" class="ch.qos.logback.classic.AsyncAppender">
           <!--指定某个具体的 appender-->
           <appender-ref ref="rollFile"/>
       </appender>
   
   
       <!--root logger 配置-->
       <root level="info">
           <appender-ref ref="console"/>
       </root>
   
       <logger name="cc.tiptip" level="info" >
           <appender-ref ref="async"/>
           <!--需要记录调试信息的时候打开-->
   <!--        <appender-ref ref="rollFileDebug"/>-->
       </logger>
   </configuration>
   ```

   

3. 使用slf4j+log4j2作为日志输出

