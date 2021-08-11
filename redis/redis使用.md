# Redis

### 一. redis使用

#### 1. springboot自动加载redis相关设置

```yaml
spring:
  redis:
    cluster:
      nodes: 192.168.1.50:6380,192.168.1.51:6380,192.168.1.52:6380,192.168.1.50:6390,192.168.1.51:6390,192.168.1.52:6390
      max-redirects: 5
    lettuce:
      cluster:
        refresh:
          adaptive: true
```

#### 2. 加载流程

* springboot autoconfigure，加载**RedisAutoConfiguration**自动配置类

  ![image-20210517210840851](redis.assets/image-20210517210840851.png)

  ![image-20210517210904683](redis.assets/image-20210517210904683.png)

* **RedisAutoConfiguration**  根据条件设置redis连接相关信息

  ![(redis.assets/image-20210517211302810.png)

* 根据配置文件中redis相关设置，设置redis连接

  ![image-20210517212340787](redis.assets/image-20210517212340787.png)

  ![image-20210517211445515](redis.assets/image-20210517211445515.png)

  ![image-20210517211624698](redis.assets/image-20210517211624698.png)

  ![image-20210517212021006](redis.assets/image-20210517212021006.png)

  ![image-20210517212159616](redis.assets/image-20210517212159616.png)

  
