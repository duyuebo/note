# docker

## 问题

1. 镜像latest代表哪个版本？

   ```shell
   # 显示docker镜像详细信息，里面有版本信息
   docker inspect mysql:latest
   ```

   

2. 开机自动启动docker（linux）？

   ```shell
   systemctl enable docker
   ```

3. 

## Mysql

### 问题

1. mysql数据库相关数据存到什么地方了？存到容器内部了吗？哪些文件应该存储在容器外？

   **存储在容器外部**，**数据库信息和配置文件应该存储在容器外。不指定文件夹时，数据库默认存储在/var/lib/docker/volumes/.../_data这样的目录里，实际目录需要使用`inspect`命令进行查看**

2. 容器删除了？数据库数据也删除了吗？如何恢复?

   **容器删除数据库数据并没有删除，可查找容器数据卷目录进行挂载恢复**

3. 安装命令是什么？

   ```shell
   #整合后的命令。目标：将mysql容器数据库相关数据存储在指定位置，方便查看
   docker run --name mysql01 -p3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d -v /opt/docker_files/mysql/_data:/var/lib/mysql -v /opt/docker_files/mysql/config:/etc/mysql/conf.d mysql:8.0.25
   ```

4. 开机自动启动数据库容器？,$CONTAINER--容器名称

   ```shell
   # --restart 可选值为：
   # no -  容器退出时，不重启容器；
   # on-failure - 只有在非0状态退出时才从新启动容器；
   # always - 无论退出状态是如何，都重启容器；
   docker update --restart=always mysql01
   ```

5. 

### 安装步骤

1. 查看dockerhub上相关信息

```shell
# 官方提供的命令：
# 这个命令只设置了容器名称 some-sql 和 mysql密码my-secret-pw
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
#上面这个命令少了端口映射从外面不好连接，加上端口映射
docker run --name mysql01 -p3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql
```

2. 启动后通过 ``` docker inspect mysql01``` 命令查看容器内部信息，显示容器内 ``` /var/lib/mysql ```目录对应机器的 ```/var/lib/docker/volumes/.../_data```目录,即：本地这个目录下存放mysql数据库相关数据

![image-20201207175510197](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207175510197.png)

3. 建立test数据库，可在```/var/lib/docker/volumes/.../_data```这个目录下看到test文件

![image-20201207180125550](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207180125550.png)

4. 删除mysql01容器

![image-20201207180829858](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207180829858.png)

5. 查看容器外数据是否还在，容器外数据还在！

![image-20201207180951286](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207180951286.png)

6. 将已经删除的数据库挂载到新启动的镜像上看 是否能够恢复

   ```
   docker run --name mysql01 -p3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d -v /var/lib/docker/volumes/46524953b544ea6b3399272de87c41d86c4a0ce00049f8142a6584ff410e5f81/_data:/var/lib/mysql mysql
   
   ```

   

7. 查看容器内数据库，发现数据库恢复了！

   ![image-20201207182409222](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207182409222.png)

8. 将以上内容整合

   * 先在本机建立mysql存储相关目录,数据库目录和配置文件目录。

   ![image-20201207184440292](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207184440292.png)

   * 编写启动命令

     ```shell
     #整合后的命令。目标：将mysql容器数据库相关数据存储在指定位置，方便查看
     docker run --name mysql01 -p3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d -v /opt/docker_files/mysql/_data:/var/lib/mysql -v /opt/docker_files/mysql/config:/etc/mysql/conf.d mysql
     ```

     

     进入容器查看文件可以得到自定义配置文件的目录，不同版本mysql可能配置目录不一样

     ![image-20201207185842290](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207185842290.png)

     

9. ```/opt/docker_files/mysql/config``` 目录下新建my.cnf配置文件

   ```
   [mysqld]
   #允许最大连接数
   max_connections=200
   # 允许连接失败的次数
   max_connect_errors=10
   ```

10. 重启docker容器 ``` docker restart mysql01``` 查看连接数显示：

    ![image-20201207193340522](/Users/dylan/Desktop/Develop/note/笔记/docker/docker.assets/image-20201207193340522.png)

11. 打完收工！

    ```shell
    #整合后的命令。目标：将mysql容器数据库相关数据存储在指定位置，方便查看
    docker run --name mysql01 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d -v /opt/docker_files/mysql/_data:/var/lib/mysql -v /opt/docker_files/mysql/config:/etc/mysql/conf.d mysql
    ```

    

