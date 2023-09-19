# nginx

## 操作命令

* 查看版本

  ```shell
  ./nginx -v
  ```

* 启动nginx

  ```shell
  #启动nginx
  ./nginx
  #检查配置文件格式是否正确
  nginx -t -c nginx.conf
  #指定启动时使用的配置文件
  nginx -c nginx.conf
  
  ```

* 重启nginx

  ```shell
  ./nginx -s reload
  ```

* 关闭nginx

  ```shell
  ./nginx -s quit
  ```

